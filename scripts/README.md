# Scripts Module - Data Scraping & Fine-Tuning Tools

Node.js scripts for web scraping, training data generation, and OpenAI model fine-tuning automation.

## Overview

This module contains two main scripts:
1. **scraper.js** - Scrapes websites and generates training data using AI
2. **fine-tune.js** - Automates the OpenAI fine-tuning process

## Features

### Web Scraper (`scraper.js`)
- 🌐 Scrapes multiple website URLs
- 🤖 Uses OpenAI to generate Q&A training pairs
- 📊 Extracts headings, paragraphs, and list items
- 💾 Outputs JSONL format for fine-tuning
- 💰 Tracks API usage costs

### Fine-Tuning Script (`fine-tune.js`)
- ✅ Validates training data format
- 📤 Uploads files to OpenAI
- 🚀 Creates and monitors fine-tuning jobs
- 📊 Real-time progress tracking
- 🎯 Supports GPT-4.1 models (nano, mini, full)

## Installation

```bash
cd scripts
npm install
```

## Configuration

### Environment Variables

Create a `.env` file in the scripts directory:

```env
OPENAI_API_KEY=sk-...your-key-here
OPENAI_ORG_ID=org-...your-org-id
```

### Scraper Configuration

Edit `scraper.js` to customize:

```javascript
const config = {
    urls: [
        {
            url: "https://your-website.com/",
            contentType: "general",
        },
        {
            url: "https://your-website.com/about",
            contentType: "about",
        },
    ],
    openai: {
        model: "gpt-5",  // Model for generating training data
        trainingExamples: 50,  // Number of Q&A pairs to generate
    },
    outputFile: "training_data.jsonl"
};
```

### Fine-Tuning Configuration

Edit `fine-tune.js` to customize:

```javascript
const CONFIG = {
    // Choose base model
    MODEL: "gpt-4.1-nano-2025-04-14",
    // Options:
    // - gpt-4.1-nano-2025-04-14 (fastest, cheapest)
    // - gpt-4.1-mini-2025-04-14 (balanced)
    // - gpt-4.1-2025-04-14 (most capable)

    TRAINING_FILE: "training_data.jsonl",
    POLL_INTERVAL: 30000  // Check status every 30 seconds
};
```

## Usage

### Step 1: Generate Training Data

```bash
node scraper.js
```

**What it does:**
1. Fetches HTML from configured URLs
2. Extracts relevant content (removes nav, scripts, ads)
3. Sends content to OpenAI to generate Q&A pairs
4. Saves to `training_data.jsonl`

**Output example:**
```json
{
  "messages": [
    {"role": "system", "content": "You are a helpful assistant..."},
    {"role": "user", "content": "What services do you offer?"},
    {"role": "assistant", "content": "We offer web development..."}
  ]
}
```

**Cost tracking:**
- Shows token usage and estimated costs
- Typical cost: $0.01-0.05 per website

### Step 2: Fine-Tune Your Model

```bash
node fine-tune.js
```

**Process:**
1. **Validation** - Checks JSONL format and minimum examples
2. **Upload** - Sends training file to OpenAI
3. **Job Creation** - Starts fine-tuning with selected model
4. **Monitoring** - Polls status until completion
5. **Result** - Returns your custom model ID

**Example output:**
```
🤖 Starting OpenAI Supervised Fine-Tuning

📋 Using model: gpt-4.1-nano-2025-04-14
📄 Training file: training_data.jsonl

🔍 Validating training data format...
✅ Validation passed: 50 valid examples

📤 Uploading training file...
✅ File uploaded: file-abc123

🚀 Creating fine-tuning job with model: gpt-4.1-nano-2025-04-14
✅ Fine-tuning job created: ftjob-xyz789

⏳ Monitoring fine-tuning job...
This typically takes 10-30 minutes...

Status: running
Status: running
Status: succeeded

🎉 Fine-tuning completed successfully!
🎆 Your fine-tuned model ID: ft:gpt-4.1-nano:org:custom:abc123

============================================================
SUCCESS! Your fine-tuned model is ready!
============================================================

Model ID: ft:gpt-4.1-nano:org:custom:abc123
Trained on 50 examples

Next steps:
1. Copy the Model ID above
2. Use it in your application to access your custom model
```

## Training Data Format

The scripts expect/generate JSONL format with this structure:

```jsonl
{"messages": [{"role": "system", "content": "..."}, {"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]}
{"messages": [{"role": "system", "content": "..."}, {"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]}
```

### Requirements:
- Minimum 10 examples
- Each line must be valid JSON
- Must include system, user, and assistant messages
- System message provides context/instructions

## Advanced Usage

### Custom Training Data

Create your own `training_data.jsonl`:

```javascript
const fs = require('fs');

const examples = [
    {
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: "Your question" },
            { role: "assistant", content: "Your answer" }
        ]
    },
    // Add more examples...
];

const jsonl = examples.map(e => JSON.stringify(e)).join('\n');
fs.writeFileSync('training_data.jsonl', jsonl);
```

### Scraping Different Sites

Modify the scraper config for your needs:

```javascript
const config = {
    urls: [
        { url: "https://docs.example.com/", contentType: "documentation" },
        { url: "https://blog.example.com/", contentType: "blog" },
        { url: "https://support.example.com/", contentType: "support" }
    ],
    openai: {
        model: "gpt-4",
        trainingExamples: 100  // More examples for complex topics
    }
};
```

## Error Handling

### Common Issues

1. **API Key Errors**
   ```
   ❌ Fine-tuning failed: Invalid API key
   💡 Tip: Set OPENAI_API_KEY in your .env file
   ```

2. **Insufficient Training Data**
   ```
   Need at least 10 valid examples. Found: 5
   ```

3. **Scraping Failures**
   ```
   Failed to fetch URL: timeout
   ```
   - Check internet connection
   - Verify URLs are accessible
   - Some sites may block scrapers

4. **Fine-Tuning Job Failed**
   - Check OpenAI dashboard for details
   - Verify training data format
   - Ensure billing is set up

## Cost Estimation

### Scraping Costs
- GPT-4 input: ~$1.25 per 1M tokens
- GPT-4 output: ~$10 per 1M tokens
- Typical website: 2-5k tokens
- 50 Q&A pairs: ~3k output tokens
- **Total per site: ~$0.01-0.05**

### Fine-Tuning Costs
- Training: ~$25 per 1M tokens
- Depends on dataset size
- 50 examples: ~10k tokens
- **Total: ~$0.25-2.00**

## Tips

### For Better Results
1. **More examples = better model** (aim for 50-500)
2. **Diverse questions** improve generalization
3. **Consistent formatting** in answers
4. **Include edge cases** in training data

### Performance Optimization
- Use `gpt-4.1-nano` for cost-effective, fast responses
- Use `gpt-4.1` for complex reasoning tasks
- Start with nano, upgrade if needed

### Monitoring
- Check job status at: https://platform.openai.com/fine-tuning
- View usage at: https://platform.openai.com/usage

## Dependencies

```json
{
  "axios": "^1.12.0",      // HTTP requests
  "cheerio": "^1.1.2",     // HTML parsing
  "dotenv": "^17.2.2",     // Environment variables
  "openai": "^5.20.2"      // OpenAI SDK
}
```

## Back to Main Documentation

[← Back to Project Root](../README.md)