# World Trends AI Prompt Generator

World Trends AI Prompt Generator is a web application that fetches real-time web trends and generates concise, AI-powered animation prompts. These prompts are designed to inspire creative projects and can be directly used with platforms like [Daydream](https://daydream.live), a real-time AI application that performs compute on top of the [Livepeer network](https://livepeer.org). The app leverages the [Livepeer LLM Pipeline](https://docs.livepeer.org/ai/pipelines/llm) for prompt generation and falls back to the [OpenAI API](https://openai.com/api/) if needed.

## Features

- **Real-Time Trends**: Fetches the latest trends using the [Twitter Trends Scraper](https://apify.com/karamelo/twitter-trends-scraper) from Apify.
- **AI-Powered Prompts**: Generates concise animation prompts using Livepeer LLM Pipelines (`meta-llama/Meta-Llama-3.1-8B-Instruct`) or OpenAI's GPT-4 model.
- **Customizable**: Allows users to select or deselect trends to tailor the generated prompts.
- **Daydream Integration**: Provides a direct link to open prompts in Daydream for seamless creative workflows.
- **Error Handling**: Displays user-friendly error messages when issues occur during trend fetching or prompt generation.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- API keys for Apify and OpenAI

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/world-trends-prompt-generator.git
   cd world-trends-prompt-generator
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Add your API keys to a `.env` file:

   ```txt
   APIFY_API_TOKEN=your-apify-api-token
   OPENAI_API_KEY=your-openai-api-key
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the app in your browser at [http://localhost:3000](http://localhost:3000).

## Usage

1. **View Trends**: The homepage displays the latest fetched trends.
2. **Customize Trends**: Select or deselect trends to refine the generated prompt.
3. **Generate Prompts**: View the AI-generated animation prompt based on your selected trends.
4. **Export**: Copy the generated prompt or open it directly in Daydream.

## Deployment

Deploy the app easily on [Vercel](https://vercel.com). For more details, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the app.
