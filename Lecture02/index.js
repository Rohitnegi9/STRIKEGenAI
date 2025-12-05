import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey:""});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
        {
            role:"user",
            parts:[{text:"What is current date"}]
        }
        // {
        //     role:'user',
        //     parts: [{text:"What is my name"}]
        // },
        // {
        //     role:'model',
        //     parts:[{text:"As an AI, I don't have access to personal information"}]
        // },
        // {
        //     role:'user',
        //     parts:[{text:"My name is Rohit Negi"}]
        // },
        // {
        //     role:'model',
        //     parts: [{text:"Thank you, Rohit. It's nice to meet you!"}]
        // },
        // {
        //     role:'user',
        //     parts: [{text:"What is my name"}]
        // },
    ]
  });
  console.log(response.text);
}

await main();


// readline sync
// history ko automation
// Chatbot: ?