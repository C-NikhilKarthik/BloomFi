const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

const GEMINI_API_KEY = "AIzaSyDPEXaPnBdXpaWc04fx4sd1dyZ1TwxD8KU";

// Initialize GoogleGenerativeAI with the API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to generate content using Gemini API
async function generateContentWithGemini(prompt) {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text(); // Assuming the response has a 'text' field with the generated content
    } catch (error) {
        console.error("Error generating content:", error.message);
        return "Error occurred during content generation";
    }
}

(async function main() {
    try {
        // Load JSON data from data.json file
        const jsonData = JSON.parse(fs.readFileSync('data.json', 'utf8'));

        // Refined prompt
        const prompt = `
        You are an AI assistant designed to provide actionable insights and trends for players engaging with an application. 
        The application context is as follows: 
        "Discover high ROI pools in the ETH ecosystem (across L2s or a particular chain) using AI. 
        The application works like a game where assets (linked to vaults) dynamically appear in a game garden based on their visibility index. 
        The height of a tree or size of an asset correlates with the visibility index, and assets below a certain visibility index threshold are removed. 

        Your task is to analyze the following data and extract meaningful insights and trends for players. Provide actionable suggestions to help them optimize their gameplay strategy." 

        Data: ${JSON.stringify(jsonData)}

        Output actionable insights and suggestions in bullet points.
        `;

        // Generate content using Gemini API
        const insights = await generateContentWithGemini(prompt);

        console.log("Generated Insights and Suggestions:");
        console.log(insights);
    } catch (error) {
        console.error("Error in main function:", error.message);
    }
})();
