import { Worker } from 'bullmq';
import dotenv from 'dotenv';
import { processPRDParsing } from './jobs/prd-parser.job';
import { processTestCaseGeneration } from './jobs/testcase-gen.job';
import { processBugAI } from './jobs/bug-ai.job';

dotenv.config();

const redisConnection = {
  host: process.env.REDIS_URL?.replace('redis://', '') || 'redis',
  port: 6379,
};

// PRD Parsing Worker
const prdWorker = new Worker('prd-parsing', processPRDParsing, {
  connection: redisConnection,
  concurrency: 2,
});

// Test Case Generation Worker
const testCaseWorker = new Worker('testcase-generation', processTestCaseGeneration, {
  connection: redisConnection,
  concurrency: 5,
});

// Bug AI Worker
const bugAiWorker = new Worker('bug-ai', processBugAI, {
  connection: redisConnection,
  concurrency: 3,
});

prdWorker.on('completed', (job) => {
  console.log(`✅ PRD Parsing job ${job.id} completed`);
});

prdWorker.on('failed', (job, err) => {
  console.error(`❌ PRD Parsing job ${job?.id} failed:`, err);
});

testCaseWorker.on('completed', (job) => {
  console.log(`✅ Test Case Generation job ${job.id} completed`);
});

testCaseWorker.on('failed', (job, err) => {
  console.error(`❌ Test Case Generation job ${job?.id} failed:`, err);
});

bugAiWorker.on('completed', (job) => {
  console.log(`✅ Bug AI job ${job.id} completed`);
});

bugAiWorker.on('failed', (job, err) => {
  console.error(`❌ Bug AI job ${job?.id} failed:`, err);
});

console.log('🔧 Cycluno Worker started and listening for jobs...');