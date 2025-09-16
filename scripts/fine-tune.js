const OpenAI = require("openai");
const fs = require("fs");
require("dotenv").config();

const CONFIG = {
    // Choose your base model for fine-tuning
    MODEL: "gpt-4.1-nano-2025-04-14", // Options: gpt-4.1-nano-2025-04-14, gpt-4.1-mini-2025-04-14, gpt-4.1-2025-04-14

    // Training file path
    TRAINING_FILE: "training_data.jsonl",

    // Polling interval for job status (in milliseconds)
    POLL_INTERVAL: 30000, // 30 seconds
};

class FineTuningManager {
    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error("OPENAI_API_KEY environment variable is required");
        }
        
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            organization: process.env.OPENAI_ORG_ID,
        });
    }

    // Step 1: Validate training data format
    validateTrainingData() {
        console.log("🔍 Validating training data format...");
        
        if (!fs.existsSync(CONFIG.TRAINING_FILE)) {
            throw new Error(`Training file not found: ${CONFIG.TRAINING_FILE}`);
        }

        const content = fs.readFileSync(CONFIG.TRAINING_FILE, "utf-8");
        const lines = content.split("\n").filter(line => line.trim());
        
        if (lines.length < 10) {
            throw new Error(`Need at least 10 examples. Found: ${lines.length}`);
        }

        let validExamples = 0;
        lines.forEach((line, index) => {
            try {
                const data = JSON.parse(line);
                
                // Validate JSONL structure as per OpenAI documentation
                if (!data.messages || !Array.isArray(data.messages) || data.messages.length < 2) {
                    throw new Error(`Invalid structure at line ${index + 1}`);
                }
                
                // Check for required roles
                const hasUser = data.messages.some(m => m.role === 'user');
                const hasAssistant = data.messages.some(m => m.role === 'assistant');
                
                if (!hasUser || !hasAssistant) {
                    throw new Error(`Missing user or assistant message at line ${index + 1}`);
                }
                
                validExamples++;
            } catch (e) {
                console.warn(`⚠️ Skipping line ${index + 1}: ${e.message}`);
            }
        });

        if (validExamples < 10) {
            throw new Error(`Need at least 10 valid examples. Found: ${validExamples}`);
        }

        console.log(`✅ Validation passed: ${validExamples} valid examples`);
        return validExamples;
    }

    // Step 2: Upload training file to OpenAI
    async uploadTrainingFile() {
        console.log("📤 Uploading training file...");

        const file = await this.openai.files.create({
            file: fs.createReadStream(CONFIG.TRAINING_FILE),
            purpose: "fine-tune",
        });

        console.log(`✅ File uploaded: ${file.id}`);
        return file.id;
    }

    // Step 3: Create fine-tuning job
    async createFineTuningJob(fileId) {
        console.log(`🚀 Creating fine-tuning job with model: ${CONFIG.MODEL}`);

        const job = await this.openai.fineTuning.jobs.create({
            training_file: fileId,
            model: CONFIG.MODEL,
            method: {
                type: "supervised"
            }
        });

        console.log(`✅ Fine-tuning job created: ${job.id}`);
        return job.id;
    }

    // Step 4: Monitor job until completion
    async monitorJob(jobId) {
        console.log("⏳ Monitoring fine-tuning job...");
        console.log("This typically takes 10-30 minutes...\n");

        while (true) {
            const job = await this.openai.fineTuning.jobs.retrieve(jobId);
            
            console.log(`Status: ${job.status}`);

            if (job.status === "succeeded") {
                console.log("\n🎉 Fine-tuning completed successfully!");
                console.log(`🎆 Your fine-tuned model ID: ${job.fine_tuned_model}`);
                return job.fine_tuned_model;
            } 
            
            if (job.status === "failed") {
                throw new Error(`Fine-tuning failed: ${job.error?.message || 'Unknown error'}`);
            }
            
            if (job.status === "cancelled") {
                throw new Error("Fine-tuning was cancelled");
            }

            // Wait before checking again
            await new Promise(resolve => setTimeout(resolve, CONFIG.POLL_INTERVAL));
        }
    }

    // Complete supervised fine-tuning workflow
    async runFineTuning() {
        try {
            console.log("🤖 Starting OpenAI Supervised Fine-Tuning\n");
            console.log(`📋 Using model: ${CONFIG.MODEL}`);
            console.log(`📄 Training file: ${CONFIG.TRAINING_FILE}\n`);
            
            // Step 1: Validate data
            const validExamples = this.validateTrainingData();
            
            // Step 2: Upload file
            const fileId = await this.uploadTrainingFile();
            
            // Step 3: Create job
            const jobId = await this.createFineTuningJob(fileId);
            
            // Step 4: Monitor completion
            const modelId = await this.monitorJob(jobId);
            
            console.log("\n" + "=".repeat(60));
            console.log("SUCCESS! Your fine-tuned model is ready!");
            console.log("=".repeat(60));
            console.log(`\n Model ID: ${modelId}`);
            console.log(`Trained on ${validExamples} examples`);
            console.log("\n Next steps:");
            console.log("1. Copy the Model ID above");
            console.log("2. Use it in your application to access your custom model");
            
            return modelId;
            
        } catch (error) {
            console.error(`\n❌ Fine-tuning failed: ${error.message}`);
            
            if (error.message.includes("not found")) {
                console.log("💡 Tip: Make sure training_data.jsonl exists in the current directory");
            } else if (error.message.includes("API_KEY")) {
                console.log("💡 Tip: Set OPENAI_API_KEY in your .env file");
            }
            
            throw error;
        }
    }
}

// Main execution
async function main() {
    const manager = new FineTuningManager();
    await manager.runFineTuning();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = FineTuningManager;