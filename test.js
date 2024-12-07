const fs = require('fs');

const GEMINI_API_KEY = "AIzaSyDPEXaPnBdXpaWc04fx4sd1dyZ1TwxD8KU";

async function generateContentWithGemini(prompt) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${GEMINI_API_KEY}`,
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch from Gemini API");
        }

        const data = await response.json();
        return data.output || "No response from Gemini API";
    } catch (error) {
        console.error("Error generating content:", error.message);
        return "Error occurred during content generation";
    }
}

(async function main() {
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
})();