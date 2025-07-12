import OpenAI from "openai";
import { wsType } from "../types/types";
import { sendToClient } from "../sockets/websocket";
import { MODEL_OPENAI } from "../config";

export class OpenAIClient {
  private static instance: OpenAIClient;
  private openai: OpenAI;

  private constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  public static getInstance(): OpenAIClient {
    if (!OpenAIClient.instance) {
      OpenAIClient.instance = new OpenAIClient();
    }
    return OpenAIClient.instance;
  }

  async sendTranslateText(clientId: string, type: wsType, text: string, targetLanguage: string): Promise<void> {
    const completion = await this.openai.chat.completions.create({
      model: MODEL_OPENAI,
      stream: true,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that translates text",
        },
        {
          role: "user",
          content: `Translate the following English text into ${targetLanguage}. If the text cannot be translated, just return the original text exactly as it is, without any changes or additional explanation:\n\n${text}`
        },
      ],
    });

    for await (const part of completion) {
      const chunk = part.choices[0].delta?.content;
      if (chunk) {
        sendToClient(clientId, { type: type, payload: chunk });
      }
    }
  }

  async generateTrueAndFalseStatements(text: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: MODEL_OPENAI,
      stream: false,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that reads a text and generates 3 statements about it. The first must be true, and the next two must be false. All statements must be separated by the '|' character. Do not add any explanation.",
        },
        {
          role: "user",
          content: `Based on the following text, generate 3 statements. The first must be true, and the next two must be false. Separate each sentence using the | character:\n\n${text}`,
        },
      ],
    });
  
    return completion.choices[0].message.content?.trim() ?? "";
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: MODEL_OPENAI,
      stream: false,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that translates text.",
        },
        {
          role: "user",
          content: `Translate the following English text into ${targetLanguage}. If the text cannot be translated, just return the original text exactly as it is, without any changes or additional explanation:\n\n${text}`
        },
      ],
    });
  
    return completion.choices[0].message.content?.trim() ?? "";
  }
}