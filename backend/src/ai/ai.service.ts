import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('GEMINI_API_KEY');
    
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not set. AI features will be disabled.');
      return;
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('Gemini AI initialized');
  }

  async extractFeaturesFromPRD(prdContent: string): Promise<any[]> {
    if (!this.model) {
      console.warn('Gemini AI not initialized. Returning empty features.');
      return [];
    }

    const prompt = `
You are a product analyst. Extract all features from the following PRD (Product Requirements Document).

For each feature, provide:
- name: Short feature name
- description: Brief description
- priority: High, Medium, or Low

Return ONLY a valid JSON array of features, no markdown, no code blocks, no other text.

PRD Content:
${prdContent}

Example format:
[
  {
    "name": "User Authentication",
    "description": "Secure login and registration system",
    "priority": "High"
  }
]
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean up response (remove markdown code blocks if present)
      const cleanText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const features = JSON.parse(cleanText);
      return Array.isArray(features) ? features : [];
    } catch (error) {
      console.error('Gemini AI Feature Extraction Error:', error.message);
      throw new Error('Failed to extract features from PRD');
    }
  }

  async generateTestCases(featureName: string, featureDescription: string): Promise<any[]> {
    if (!this.model) {
      console.warn('Gemini AI not initialized. Returning empty test cases.');
      return [];
    }

    const prompt = `
You are a QA engineer. Generate comprehensive test cases for the following feature.

Feature Name: ${featureName}
Feature Description: ${featureDescription || 'No description provided'}

For each test case, provide:
- scenario: Test scenario name
- description: Brief description of what is being tested
- steps: Array of step-by-step instructions (as strings)
- testData: Sample test data (if applicable, otherwise empty string)
- expectedResult: Expected outcome
- priority: High, Medium, or Low

Generate at least 5 diverse test cases covering positive, negative, edge cases, and boundary conditions.

Return ONLY a valid JSON array of test cases, no markdown, no code blocks, no other text.

Example format:
[
  {
    "scenario": "Valid user login",
    "description": "Test successful login with valid credentials",
    "steps": ["Navigate to login page", "Enter valid email", "Enter valid password", "Click login button"],
    "testData": "email: test@example.com, password: Test123!",
    "expectedResult": "User is redirected to dashboard",
    "priority": "High"
  }
]
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const testCases = JSON.parse(cleanText);
      return Array.isArray(testCases) ? testCases : [];
    } catch (error) {
      console.error('Gemini AI Test Case Generation Error:', error.message);
      throw new Error('Failed to generate test cases');
    }
  }

  async generateBugReport(testCase: any, actualResult: string): Promise<any> {
    if (!this.model) {
      console.warn('Gemini AI not initialized. Returning basic bug report.');
      return {
        title: 'Test Failed',
        description: 'Automated bug report generation unavailable',
        stepsToReproduce: testCase.steps || [],
        expectedResult: testCase.expectedResult,
        actualResult,
        possibleSolution: 'Manual investigation required',
        priority: 'Medium',
        severity: 'Major',
      };
    }

    const prompt = `
You are a QA engineer. A test case has failed. Generate a detailed bug report.

Test Case Information:
- Scenario: ${testCase.scenario}
- Expected Result: ${testCase.expectedResult}
- Actual Result: ${actualResult}
- Steps: ${JSON.stringify(testCase.steps)}

Generate a bug report with:
- title: Clear, concise bug title (max 100 characters)
- description: Detailed description of the bug
- stepsToReproduce: Array of steps to reproduce the bug (as strings)
- expectedResult: What should happen
- actualResult: What actually happened
- possibleSolution: Suggested fix or root cause analysis
- priority: Critical, High, Medium, or Low
- severity: Critical, Major, Minor, or Trivial

Return ONLY a valid JSON object, no markdown, no code blocks, no other text.

Example format:
{
  "title": "Login fails with valid credentials",
  "description": "Users cannot log in even with correct email and password",
  "stepsToReproduce": ["Go to login page", "Enter valid credentials", "Click login"],
  "expectedResult": "User should be logged in",
  "actualResult": "Error message displayed",
  "possibleSolution": "Check authentication service connection",
  "priority": "High",
  "severity": "Major"
}
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      return JSON.parse(cleanText);
    } catch (error) {
      console.error('Gemini AI Bug Report Generation Error:', error.message);
      return {
        title: 'Test Failed: ' + testCase.scenario,
        description: 'Automated bug report generation failed',
        stepsToReproduce: testCase.steps || [],
        expectedResult: testCase.expectedResult,
        actualResult,
        possibleSolution: 'Manual investigation required',
        priority: 'Medium',
        severity: 'Major',
      };
    }
  }

  async compareResults(expectedResult: string, actualResult: string): Promise<{ match: boolean; confidence: number }> {
    if (!this.model) {
      console.warn('Gemini AI not initialized. Returning no match.');
      return { match: false, confidence: 0 };
    }

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

Return ONLY valid JSON, no markdown, no code blocks, no other text.

Example format:
{
  "match": true,
  "confidence": 0.95
}
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      return JSON.parse(cleanText);
    } catch (error) {
      console.error('Gemini AI Result Comparison Error:', error.message);
      return { match: false, confidence: 0 };
    }
  }
}