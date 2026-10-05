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
        .max(
          2000,
          "message is too long"),

    action: z.enum(["MESSAGE", "SET_ORIGIN"]).optional(),
    origin: z.string().trim().length(3).toUpperCase().optional(),

  }).superRefine((value, ctx) => {
    if (value.action === "SET_ORIGIN") {
      if (!value.origin) ctx.addIssue({ code: "custom", path: ["origin"], message: "origin is required" });
      return;
    }
    if (!value.message) ctx.addIssue({ code: "custom", path: ["message"], message: "message is required" });
  });
