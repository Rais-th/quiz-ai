import { Handler } from '@netlify/functions';
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { questionSchema, questionsSchema } from "@/lib/schemas";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { files, subject } = JSON.parse(event.body || '{}');

    const prompt = subject 
      ? `Create a quiz about ${subject} with 4 multiple choice questions. Each question should:
         - Be clear and concise
         - Have 4 answer options (A, B, C, D)
         - Each answer should be 1-2 sentences maximum
         - Have only one correct answer
         - Focus on practical, real-world scenarios
         - Be challenging but fair
         Format the response as a JSON array of objects with the following structure:
         { "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": 0 }`
      : `Based on the provided PDF content, create 4 multiple choice questions. Each question should:
         - Be clear and concise
         - Have 4 answer options (A, B, C, D)
         - Each answer should be 1-2 sentences maximum
         - Have only one correct answer
         - Test understanding, not memorization
         - Be challenging but fair
         Format the response as a JSON array of objects with the following structure:
         { "question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": 0 }`;

    const result = await streamObject({
      model: google("gemini-1.5-pro-latest"),
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: subject
            ? `Create practical, real-world questions about ${subject} focusing on best practices and common scenarios.`
            : [
                {
                  type: "text",
                  text: "Create questions based on this document.",
                },
                {
                  type: "file",
                  data: files[0].data,
                  mimeType: "application/pdf",
                },
              ],
        },
      ],
      schema: questionSchema,
      output: "array",
      onFinish: ({ object }) => {
        const res = questionsSchema.safeParse(object);
        if (res.error) {
          throw new Error(res.error.errors.map((e) => e.message).join("\n"));
        }
      },
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Quiz generation error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate quiz. Please try again." }),
    };
  }
}; 