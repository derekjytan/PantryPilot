const OpenAI = require('openai'); // Import the OpenAI library

const dotenv = require('dotenv'); // Managing environment variables
dotenv.config({ path: './.env' }); // Loading environment variables from .env file

// Create an instance of the OpenAI API client using the API key from the environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Asynchronous function to send a prompt to the OpenAI API and retrieve the response
async function queryOpenAI(prompt) {
    try {
        // Send a request to the OpenAI API to create a chat completion using the specified model
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'user', content: prompt } // prompt
            ],
            max_tokens: 100,
        });
  
        // Return the text content of the first choice in the response
        // Trim function to remove the extra spaces
        return response.choices[0].message.content.trim(); 
    } 
    catch (error) {
        console.error('Error querying OpenAI:', error);
    }
}

module.exports = queryOpenAI;