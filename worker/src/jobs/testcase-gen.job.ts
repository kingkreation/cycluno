import { Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { AiService } from '../services/ai.service';

const prisma = new PrismaClient();
const aiService = new AiService();

export async function processTestCaseGeneration(job: Job) {
  const { productId, featureId, featureName, featureDescription, userId } = job.data;

  try {
    console.log(`Generating test cases for feature: ${featureName}...`);

    // Generate test cases using AI
    const testCases = await aiService.generateTestCases(featureName, featureDescription);

    // Get current test case count for ID generation
    const existingCount = await prisma.testCase.count({
      where: { productId },
    });

    // Save test cases to database
    const createdTestCases = [];
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const testCaseId = `TC-${String(existingCount + i + 1).padStart(3, '0')}`;

      const created = await prisma.testCase.create({
        data: {
          productId,
          featureId,
          testCaseId,
          scenario: testCase.scenario,
          description: testCase.description,
          steps: testCase.steps,
          testData: testCase.testData,
          expectedResult: testCase.expectedResult,
          priority: testCase.priority || 'Medium',
          loggedBy: userId,
        },
      });

      createdTestCases.push(created);
    }

    console.log(`✅ Generated ${createdTestCases.length} test cases for ${featureName}`);

    return {
      success: true,
      testCasesCount: createdTestCases.length,
    };
  } catch (error) {
    console.error('Test Case Generation Error:', error);
    throw error;
  }
}