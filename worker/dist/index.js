"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables FIRST, before any other imports
dotenv_1.default.config();
const bullmq_1 = require("bullmq");
const prd_parser_job_1 = require("./jobs/prd-parser.job");
const testcase_gen_job_1 = require("./jobs/testcase-gen.job");
const bug_ai_job_1 = require("./jobs/bug-ai.job");
console.log('🔍 Environment check:');
console.log('  - GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing');
console.log('  - DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
console.log('  - REDIS_URL:', process.env.REDIS_URL ? '✅ Set' : '❌ Missing');
// Parse Redis URL properly
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
let redisConnection;
try {
    const url = new URL(redisUrl);
    redisConnection = {
        host: url.hostname,
        port: parseInt(url.port) || 6379,
        password: url.password || undefined,
    };
}
catch (error) {
    // Fallback parsing
    const urlParts = redisUrl.replace(/^rediss?:\/\//, '').split(':');
    redisConnection = {
        host: urlParts[0] || '127.0.0.1',
        port: parseInt(urlParts[1]) || 6379,
    };
}
console.log('🔗 Worker Redis connection:', redisConnection);
// Check Redis availability before creating workers
const canConnectRedis = async () => {
    try {
        const Redis = require('ioredis');
        const testClient = new Redis(redisConnection);
        await testClient.ping();
        testClient.disconnect();
        console.log('✅ Redis is available');
        return true;
    }
    catch (error) {
        console.warn('⚠️  Redis not available:', error.message);
        return false;
    }
};
const startWorkers = async () => {
    const redisAvailable = await canConnectRedis();
    if (!redisAvailable) {
        console.error('❌ Redis is not available. Workers cannot start.');
        console.warn('   Start Redis: docker run -d -p 6379:6379 --name redis redis:7-alpine');
        console.warn('   Or update REDIS_URL in worker/.env');
        process.exit(1);
    }
    // PRD Parsing Worker
    const prdWorker = new bullmq_1.Worker('prd-parsing', prd_parser_job_1.processPRDParsing, {
        connection: redisConnection,
        concurrency: 2,
    });
    // Test Case Generation Worker
    const testCaseWorker = new bullmq_1.Worker('testcase-generation', testcase_gen_job_1.processTestCaseGeneration, {
        connection: redisConnection,
        concurrency: 5,
    });
    // Bug AI Worker
    const bugAiWorker = new bullmq_1.Worker('bug-ai', bug_ai_job_1.processBugAI, {
        connection: redisConnection,
        concurrency: 3,
    });
    prdWorker.on('completed', (job) => {
        console.log(`✅ PRD Parsing job ${job.id} completed`);
    });
    prdWorker.on('failed', (job, err) => {
        console.error(`❌ PRD Parsing job ${job?.id} failed:`, err.message);
    });
    testCaseWorker.on('completed', (job) => {
        console.log(`✅ Test Case Generation job ${job.id} completed`);
    });
    testCaseWorker.on('failed', (job, err) => {
        console.error(`❌ Test Case Generation job ${job?.id} failed:`, err.message);
    });
    bugAiWorker.on('completed', (job) => {
        console.log(`✅ Bug AI job ${job.id} completed`);
    });
    bugAiWorker.on('failed', (job, err) => {
        console.error(`❌ Bug AI job ${job?.id} failed:`, err.message);
    });
    console.log('🔧 Cycluno Worker started and listening for jobs...');
    console.log('📡 Connected to Redis at', `${redisConnection.host}:${redisConnection.port}`);
};
// Start workers
startWorkers().catch((error) => {
    console.error('❌ Failed to start workers:', error);
    process.exit(1);
});
