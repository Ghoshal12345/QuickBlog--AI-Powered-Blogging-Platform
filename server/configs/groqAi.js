import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getGroqChatCompletion(prompt) {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        model: "openai/gpt-oss-20b",
    });
}

async function generateContent(prompt) {
    const chatCompletion = await getGroqChatCompletion(prompt);
    // Print the completion returned by the LLM.
    return chatCompletion.choices[0]?.message?.content || "";
}

export default generateContent;