import type {
  Request,
  Response,
} from "express";

import {
  ChatRequestSchema,
} from "./chat.schema.js";

import {
  chatService,
} from "./chat.service.js";


export async function chatController(
  req: Request,
  res: Response
): Promise<void> {

  const parsed =
    ChatRequestSchema.safeParse(
      req.body
    );


  if (!parsed.success) {

    res.status(400).json({
      success:
        false,

      error:
        "INVALID_REQUEST",

      message:
        "Invalid chat request.",

      details:
        parsed.error.flatten()
          .fieldErrors,
    });

    return;
  }


  try {

    const result =
      await chatService
        .sendMessage(
          parsed.data
        );


    res.status(200).json({
      success:
        true,

      ...result,
    });


  } catch (error) {

    console.error(
      "Chat controller error:",
      error
    );


    res.status(500).json({
      success:
        false,

      type:
        "ERROR",

      message:
        "Unable to process your request right now.",
    });
  }
}