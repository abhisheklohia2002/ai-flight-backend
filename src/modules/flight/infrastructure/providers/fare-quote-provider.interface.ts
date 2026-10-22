import type {
  FareQuoteRequest,
} from "../../domain/fare-quote.js";

import type {
  FareQuote,
} from "../../../../ai/schemas/fare-quote.schema.js";

export interface FareQuoteProvider {
  getFareQuote(
    request: FareQuoteRequest
  ): Promise<FareQuote>;
}