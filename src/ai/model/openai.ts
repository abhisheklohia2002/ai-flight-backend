import { ChatOpenAI } from "@langchain/openai";
import { env } from "../../config/env.js";

export const openAI = new ChatOpenAI({
  apiKey: env.OPENAI_API_KEY,
  model: env.OPENAI_MODEL,
  maxRetries: 2,
});