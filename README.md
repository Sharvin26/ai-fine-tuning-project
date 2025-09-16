# OpenAI Fine-Tuning Chatbot Project

A complete solution for creating custom AI chatbots using OpenAI's fine-tuning API. This project includes web scraping tools to generate training data, fine-tuning automation scripts, and a modern Next.js chat interface for interacting with your custom model.

## 🎯 Project Overview

This project helps you:
1. **Scrape website content** to generate training data for your chatbot
2. **Fine-tune OpenAI models** with your custom data using supervised learning
3. **Deploy a chat interface** to interact with your fine-tuned model

## 📁 Project Structure

```
ai-fine-tuning-project/
├── scripts/              # Data scraping and fine-tuning automation
│   ├── scraper.js       # Web scraper that generates training data
│   ├── fine-tune.js     # OpenAI fine-tuning automation script
│   └── package.json     # Node.js dependencies for scripts
├── web/                 # Next.js chat application
│   ├── src/
│   │   ├── app/         # App router and API routes
│   │   ├── components/  # React components (chat UI)
│   │   └── types/       # TypeScript type definitions
│   └── package.json     # Next.js dependencies
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ and npm
- OpenAI API key with fine-tuning access
- Git

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/Sharvin26/ai-fine-tuning-project
cd ai-fine-tuning-project

# Install script dependencies
cd scripts
npm install

# Install web dependencies
cd ../web
npm install
cd ..
```

### Step 2: Configure Environment

Create a `.env` file in the `scripts` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ORG_ID=your_organization_id_here  # Optional
```

Create a `.env.local` file in the `web` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ORG_ID=your_organization_id_here
FINE_TUNED_MODEL=your_fine_tuned_model_id_here
```

### Step 3: Generate Training Data

```bash
cd scripts
node scraper.js
```

This will:
- Scrape configured websites (default: MTechZilla)
- Use OpenAI to generate Q&A training pairs
- Save data to `training_data.jsonl`

### Step 4: Fine-tune Your Model

```bash
node fine-tune.js
```

This will:
- Validate your training data
- Upload to OpenAI
- Start fine-tuning job
- Monitor progress (typically 10-30 minutes)
- Output your custom model ID

### Step 5: Update Chat Interface

Update the model ID in `web/.env.local` with your fine-tuned model:

```env
FINE_TUNED_MODEL=your_fine_tuned_model_id_here
```

### Step 6: Launch Chat Interface

```bash
cd web
npm run dev
```

Visit http://localhost:3000 to interact with your custom chatbot!

## 📚 Module Documentation

- [Scripts Module](./scripts/README.md) - Web scraping and fine-tuning tools
- [Web Module](./web/README.md) - Next.js chat interface

## 🛠️ Technology Stack

- **Fine-tuning**: OpenAI API (GPT-4.1 models)
- **Web Scraping**: Cheerio, Axios
- **Chat Interface**: Next.js 15, TypeScript, Tailwind CSS
- **AI SDK**: Vercel AI SDK for streaming responses
- **UI Components**: Radix UI

## 💰 Cost Estimation

- **Scraping**: ~$0.01-0.05 per website (using GPT-4 for data generation)
- **Fine-tuning**: ~$0.25-2.00 depending on training data size
- **Chat Usage**: Standard OpenAI API pricing for your model

## 🤝 Contributing

Contributions are welcome! Please read the module-specific documentation before contributing.

## 📝 License

MIT