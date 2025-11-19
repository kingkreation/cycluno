import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async extractFeaturesFromPRD(prdContent: string): Promise<any[]> {
    const prompt = `
You are a product analyst. Extract all features from the following PRD (Product Requirements Document).

For each feature, provide:
- name: Short feature name
- description: Brief description
- priority: High, Medium, or Low

Return ONLY a JSON array of features, no other text.

PRD Content:
${prdContent}
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      });

      const content = response.choices[0].message.content;
      const features = JSON.parse(content);
      return features;
    } catch (error) {
      console.error('AI Feature Extraction Error:', error);
      throw new Error('Failed to extract features from PRD');
    }
  }

  async generateTestCases(featureName: string, featureDescription: string): Promise<any[]> {
    const prompt = `
You are a QA engineer. Generate comprehensive test cases for the following feature.

Feature Name: ${featureName}
Feature Description: ${featureDescription || 'No description provided'}

For each test case, provide:
- scenario: Test scenario name
- description: Brief description of what is being tested
- steps: Array of step-by-step instructions
- testData: Sample test data (if applicable)
- expectedResult: Expected outcome
- priority: High, Medium, or Low

Generate at least 5 diverse test cases covering positive, negative, edge cases, and boundary conditions.

Return ONLY a JSON array of test cases, no other text.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
      });

      const content = response.choices[0].message.content;
      const testCases = JSON.parse(content);
      return testCases;
    } catch (error) {
      console.error('AI Test Case Generation Error:', error);
      throw new Error('Failed to generate test cases');
    }
  }

  async generateBugReport(testCase: any, actualResult: string): Promise<any> {
    const prompt = `
You are a QA engineer. A test case has failed. Generate a detailed bug report.

Test Case Information:
- Scenario: ${testCase.scenario}
- Expected Result: ${testCase.expectedResult}
- Actual Result: ${actualResult}
- Steps: ${JSON.stringify(testCase.steps)}

Generate a bug report with:
- title: Clear, concise bug title
- description: Detailed description of the bug
- stepsToReproduce: Array of steps to reproduce the bug
- expectedResult: What should happen
- actualResult: What actually happened
- possibleSolution: Suggested fix or root cause analysis
- priority: Critical, High, Medium, or Low
- severity: Critical, Major, Minor, or Trivial

Return ONLY a JSON object, no other text.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
      });

      const content = response.choices[0].message.content;
      const bugReport = JSON.parse(content);
      return bugReport;
    } catch (error) {
      console.error('AI Bug Report Generation Error:', error);
      throw new Error('Failed to generate bug report');
    }
  }

  async compareResults(expectedResult: string, actualResult: string): Promise<{ match: boolean; confidence: number }> {
    const prompt = `
Compare the following expected and actual test results. Determine if they match.

Expected Result: ${expectedResult}
Actual Result: ${actualResult}

Return ONLY a JSON object with:
- match: boolean (true if results match, false otherwise)
- confidence: number between 0 and 1 indicating confidence level

Consider:
- Minor formatting differences should not affect the match
- Focus on functional equivalence
- Be lenient with whitespace and punctuation
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      });

      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('AI Result Comparison Error:', error);
      return { match: false, confidence: 0 };
    }
  }
}