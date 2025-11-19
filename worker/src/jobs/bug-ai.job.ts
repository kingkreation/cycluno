import { Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { AiService } from '../services/ai.service';

const prisma = new PrismaClient();
const aiService = new AiService();

export async function processBugAI(job: Job) {
  const { executionCaseId, testCase, actualResult, productId, userId } = job.data;

  try {
    console.log(`Generating AI bug report for execution case ${executionCaseId}...`);

    // Generate bug report using AI
    const bugReport = await aiService.generateBugReport(testCase, actualResult);

    // Get current bug count for ID generation
    const existingCount = await prisma.bug.count({
      where: { productId },
    });
    const bugId = `BUG-${String(existingCount + 1).padStart(3, '0')}`;

    // Create bug in database
    const bug = await prisma.bug.create({
      data: {
        productId,
        executionCaseId,
        bugId,
        title: bugReport.title,
        description: bugReport.description,
        stepsToReproduce: bugReport.stepsToReproduce,
        expectedResult: bugReport.expectedResult || testCase.expectedResult,
        actualResult: bugReport.actualResult || actualResult,
        possibleSolution: bugReport.possibleSolution,
        priority: bugReport.priority || 'Medium',
        severity: bugReport.severity || 'Major',
        reportedBy: userId,
        status: 'Open',
      },
    });

    console.log(`✅ Created bug report: ${bugId}`);

    return {
      success: true,
      bugId: bug.bugId,
    };
  } catch (error) {
    console.error('Bug AI Generation Error:', error);
    throw error;
  }
}