import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QueueService {
  private prdParsingQueue: Queue | null = null;
  private testCaseGenQueue: Queue | null = null;
  private bugAiQueue: Queue | null = null;
  private redisAvailable: boolean = false;

  constructor(private configService: ConfigService) {
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
      } catch (error) {
        const urlParts = redisUrl.replace(/^rediss?:\/\//, '').split(':');
        redisConfig = {
          host: urlParts[0] || 'localhost',
          port: parseInt(urlParts[1]) || 6379,
        };
      }

      console.log('🔗 Connecting to Redis:', `${redisConfig.host}:${redisConfig.port}`);

      this.prdParsingQueue = new Queue('prd-parsing', { connection: redisConfig });
      this.testCaseGenQueue = new Queue('testcase-generation', { connection: redisConfig });
      this.bugAiQueue = new Queue('bug-ai', { connection: redisConfig });
      
      this.redisAvailable = true;
      console.log('✅ Redis queues initialized');
    } catch (error) {
      console.warn('⚠️  Redis connection failed. Background jobs disabled.');
      console.warn('   Error:', error.message);
    }
  }

  async addPRDParsingJob(data: any) {
    if (!this.redisAvailable || !this.prdParsingQueue) {
      console.warn('⚠️  Redis unavailable. PRD parsing skipped.');
      return null;
    }
    return this.prdParsingQueue.add('parse-prd', data);
  }

  async addTestCaseGenerationJob(data: any) {
    if (!this.redisAvailable || !this.testCaseGenQueue) {
      console.warn('⚠️  Redis unavailable. Test case generation skipped.');
      return null;
    }
    return this.testCaseGenQueue.add('generate-testcases', data);
  }

  async addBugAiJob(data: any) {
    if (!this.redisAvailable || !this.bugAiQueue) {
      console.warn('⚠️  Redis unavailable. Bug AI job skipped.');
      return null;
    }
    return this.bugAiQueue.add('generate-bug-report', data);
  }
}

/*
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QueueService {
  private prdParsingQueue: Queue;
  private testCaseGenQueue: Queue;
  private bugAiQueue: Queue;

  constructor(private configService: ConfigService) {
    const redisConnection = {
      host: this.configService.get('REDIS_URL')?.replace('redis://', '') || 'redis',
      port: 6379,
    };

    this.prdParsingQueue = new Queue('prd-parsing', { connection: redisConnection });
    this.testCaseGenQueue = new Queue('testcase-generation', { connection: redisConnection });
    this.bugAiQueue = new Queue('bug-ai', { connection: redisConnection });
  }

  async addPRDParsingJob(data: any) {
    return this.prdParsingQueue.add('parse-prd', data);
  }

  async addTestCaseGenerationJob(data: any) {
    return this.testCaseGenQueue.add('generate-testcases', data);
  }

  async addBugAiJob(data: any) {
    return this.bugAiQueue.add('generate-bug-report', data);
  }
}
  */