"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const config_1 = require("@nestjs/config");
let QueueService = class QueueService {
    constructor(configService) {
        this.configService = configService;
        this.prdParsingQueue = null;
        this.testCaseGenQueue = null;
        this.bugAiQueue = null;
        this.redisAvailable = false;
        const redisUrl = this.configService.get('REDIS_URL');
        if (!redisUrl) {
            console.warn('⚠️  REDIS_URL not set. Background jobs disabled.');
            return;
        }
        try {
            let redisConfig;
            try {
                const url = new URL(redisUrl);
                redisConfig = {
                    host: url.hostname,
                    port: parseInt(url.port) || 6379,
                    password: url.password || undefined,
                    tls: url.protocol === 'rediss:' ? {} : undefined,
                };
            }
            catch (error) {
                const urlParts = redisUrl.replace(/^rediss?:\/\//, '').split(':');
                redisConfig = {
                    host: urlParts[0] || 'localhost',
                    port: parseInt(urlParts[1]) || 6379,
                };
            }
            console.log('🔗 Connecting to Redis:', `${redisConfig.host}:${redisConfig.port}`);
            this.prdParsingQueue = new bullmq_1.Queue('prd-parsing', { connection: redisConfig });
            this.testCaseGenQueue = new bullmq_1.Queue('testcase-generation', { connection: redisConfig });
            this.bugAiQueue = new bullmq_1.Queue('bug-ai', { connection: redisConfig });
            this.redisAvailable = true;
            console.log('✅ Redis queues initialized');
        }
        catch (error) {
            console.warn('⚠️  Redis connection failed. Background jobs disabled.');
            console.warn('   Error:', error.message);
        }
    }
    async addPRDParsingJob(data) {
        if (!this.redisAvailable || !this.prdParsingQueue) {
            console.warn('⚠️  Redis unavailable. PRD parsing skipped.');
            return null;
        }
        return this.prdParsingQueue.add('parse-prd', data);
    }
    async addTestCaseGenerationJob(data) {
        if (!this.redisAvailable || !this.testCaseGenQueue) {
            console.warn('⚠️  Redis unavailable. Test case generation skipped.');
            return null;
        }
        return this.testCaseGenQueue.add('generate-testcases', data);
    }
    async addBugAiJob(data) {
        if (!this.redisAvailable || !this.bugAiQueue) {
            console.warn('⚠️  Redis unavailable. Bug AI job skipped.');
            return null;
        }
        return this.bugAiQueue.add('generate-bug-report', data);
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], QueueService);
//# sourceMappingURL=queue.service.js.map