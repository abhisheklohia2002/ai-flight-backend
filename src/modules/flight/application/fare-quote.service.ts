import type {
  FareQuoteProvider,
} from "../infrastructure/providers/fare-quote-provider.interface.js";

import type {
  FareQuoteRequest,
} from "../domain/fare-quote.js";

export class FareQuoteService {

  constructor(
    private readonly provider:
      FareQuoteProvider
  ) {}

  execute(
    request: FareQuoteRequest
  ) {
    return this.provider
      .getFareQuote(
        request
      );
  }
}