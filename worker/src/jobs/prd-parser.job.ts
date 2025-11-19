import { Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { AiService } from '../services/ai.service';
import * as fs from 'fs';

const prisma = new PrismaClient();
const aiService = new AiService();

export async function processPRDParsing(job: Job) {
  const { productId, prdContent, filePath } = job.data;

  try {
    console.log(`Processing PRD for product ${productId}...`);

    // Extract features using AI
    const features = await aiService.extractFeaturesFromPRD(prdContent);

    // Save features to database
    const createdFeatures = await prisma.feature.createMany({
      data: features.map((feature: any) => ({
        productId,
        name: feature.name,
        description: feature.description,
        priority: feature.priority || 'Medium',
        source: 'prd',
      })),
    });

    // Clean up uploaded file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.log(`✅ Extracted ${createdFeatures.count} features from PRD`);

    return {
      success: true,
      featuresCount: createdFeatures.count,
    };
  } catch (error) {
    console.error('PRD Parsing Error:', error);
    throw error;
  }
}