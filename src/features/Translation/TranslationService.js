// src/features/Transcription/TranslationService.js
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Use your environment variable here
  dangerouslyAllowBrowser: true, // Enables browser use
});

export const translateText = async (text, targetLanguage) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a translator. Translate the following text to ${targetLanguage}.`,
        },
        { role: "user", content: text },
      ],
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error translating text:", error);
    throw error;
  }
};
