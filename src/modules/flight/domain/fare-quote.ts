export interface FareQuoteSelection {
  itineraryId: string;
  resultIndex: string;
}

export interface FareQuoteRequest {
  traceId: string;
  selections: FareQuoteSelection[];
}