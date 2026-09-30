import {
  z,
} from "zod";


export const ChatRequestSchema =
  z.object({

    sessionId:
      z.string()
        .min(
          1,
          "sessionId is required"
        ),

    message:
      z.string()
        .trim()
        .min(
          1,
          "message is required"
        )
        .max(
          2000,
          "message is too long"
        ),

  });