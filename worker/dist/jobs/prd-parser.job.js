"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPRDParsing = processPRDParsing;
const client_1 = require("@prisma/client");
const ai_service_1 = require("../services/ai.service");
const fs = __importStar(require("fs"));
const prisma = new client_1.PrismaClient();
const aiService = new ai_service_1.AiService();
async function processPRDParsing(job) {
    const { productId, prdContent, filePath } = job.data;
    try {
        console.log(`Processing PRD for product ${productId}...`);
        // Extract features using AI
        const features = await aiService.extractFeaturesFromPRD(prdContent);
        // Save features to database
        const createdFeatures = await prisma.feature.createMany({
            data: features.map((feature) => ({
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
    }
    catch (error) {
        console.error('PRD Parsing Error:', error);
        throw error;
    }
}
