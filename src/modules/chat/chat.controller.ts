import type { Request, Response } from "express";

import { ChatRequestSchema } from "./chat.schema.js";

import { chatService } from "./chat.service.js";
import { searchAirportService } from "../flight/application/search-airport.service.js";

export async function chatController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = ChatRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,

      error: "INVALID_REQUEST",

      message: "Invalid chat request.",

      details: parsed.error.flatten().fieldErrors,
    });

    return;
  }

  try {
    const result = await chatService.sendMessage(parsed.data);

    res.status(200).json({
      success: true,

      ...result,
    });
  } catch (error) {
    console.error("Chat controller error:", error);

    res.status(500).json({
      success: false,

      type: "ERROR",

      message: "Unable to process your request right now.",
    });
  }
}

export async function airportController(
  req: Request,
  res: Response,
): Promise<void> {
  const search =
    typeof req.query.search === "string" ? req.query.search.trim() : "";
  if (search.length < 2) {
    res.status(400).json({
      success: false,
      error: "INVALID_SEARCH",
      message: "search must be at least 2 characters.",
    });
    return;
  }
  try {
    const airports = await searchAirportService.execute(search);
    res.status(200).json({ success: true, airports });
  } catch (error) {
    console.error("Airport controller error:", error);
    res.status(502).json({
      success: false,
      error: "AIRPORT_SEARCH_FAILED",
      message: "Unable to search airports right now.",
    });
  }
}

function sendEvent(res: Response, event: string, data: unknown): boolean {
  if (res.writableEnded || res.destroyed) {
    return false;
  }

  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  return true;
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function streamController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = ChatRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: "INVALID_REQUEST",
      message: "Invalid chat request.",
      details: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  res.status(200);
  res.set({
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.flushHeaders();

  let terminalSent = false;
  const end = (): void => {
    if (!terminalSent) {
      terminalSent = true;
      if (!res.writableEnded && !res.destroyed) {
        res.end();
      }
    }
  };

  const streamText = async (text: string, type: string): Promise<boolean> => {
    const id = `assistant-${crypto.randomUUID()}`;
    if (!sendEvent(res, "text_start", { id, type })) return false;
    // Split after whitespace so the client receives the exact original text.
    for (const delta of text.match(/\S+\s*|\s+/g) ?? []) {
      if (!sendEvent(res, "text_delta", { id, delta })) return false;
      await wait(12);
    }
    return sendEvent(res, "text_end", { id });
  };

  try {
    const result = await chatService.sendMessage(parsed.data);

    if (result.type === "ERROR") {
      sendEvent(res, "error", {
        message: result.message,
      });

      return end();
    }

    if (!(await streamText(result.message, result.type))) {
      return end();
    }

    /**
     * Fare quote
     */
    if (result.type === "FARE_QUOTE") {
      sendEvent(res, "fare_quote", {
        fareQuote: result.data?.fareQuote,

        selectedFlightId: result.data?.selectedFlightId,
      });

      sendEvent(res, "done", {
        type: result.type,
      });

      return end();
    }

    if (result.type === "PASSENGER_DETAILS_COMPLETE") {
      sendEvent(res, "ssr_options", { ssrOptions: result.data?.ssrOptions });
      sendEvent(res, "passenger_details_complete", { bookingStep: "PASSENGER_DETAILS_COMPLETE" });
      sendEvent(res, "done", { type: result.type });
      return end();
    }
    if (result.type === "BOOKING_PREPARED") {
      sendEvent(res, "booking_prepared", { bookingPrepare: result.data?.bookingPrepare });
      sendEvent(res, "done", { type: result.type });
      return end();
    }

    /**
     * Airport selection
     */
    if (result.type === "AIRPORT_SELECTION") {
      sendEvent(res, "airports", {
        selectionFor: result.data?.airportSelectionFor,

        airports: result.data?.airports ?? [],
      });

      sendEvent(res, "done", {
        type: result.type,
      });

      return end();
    }

    if (result.type === "FLIGHT_RESULTS") {
      const flights = result.data?.flights ?? [];
      sendEvent(res, "status", { message: `Found ${flights.length} flights` });
      for (const flight of flights) {
        if (!sendEvent(res, "flight", flight)) return end();
      }
      sendEvent(res, "done", {
        type: result.type,
        total: flights.length,
        search: result.data?.search,
        traceId: result.data?.traceId,
        expiryAt: result.data?.expiryAt,
      });
      return end();
    }

    if (result.type === "CALENDAR_RESULTS") {
      sendEvent(res, "calendar", {
        calendarFares: result.data?.calendarFares ?? [],
        search: result.data?.search,
        traceId: result.data?.traceId,
      });
      sendEvent(res, "done", { type: result.type });
      return end();
    }

    sendEvent(res, "done", { type: result.type });
    end();
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "The request was cancelled."
        : "Unable to process your request right now.";
    if (!res.writableEnded && !res.destroyed) {
      sendEvent(res, "error", { message });
    }
    end();
  }
}
