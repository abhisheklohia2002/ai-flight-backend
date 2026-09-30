export function buildIntentPrompt(
  userMessage: string,
  hasActiveSearch: boolean
): string {

  return `
You classify the intent of a conversational flight assistant.

Current user message:
"${userMessage}"

There is currently an active flight search:
${hasActiveSearch ? "YES" : "NO"}

Possible intents:

SEARCH_FLIGHT
- User is starting a new flight search.
- Example:
  "Delhi to Mumbai tomorrow"

MODIFY_SEARCH
- User is modifying an existing flight search.
- Examples:
  "Make it 2 adults"
  "Change it to tomorrow"
  "10 October 2026"
  "Only SpiceJet"
  "Direct flights only"
  "Under 5000"
  "Show evening flights"

Important:
If an active flight search exists and the user gives only
a date, passenger count, airline, price limit, time preference,
route change, or filter, classify it as MODIFY_SEARCH.

CALENDAR_SEARCH
- User wants cheaper dates or calendar fares.
- Examples:
  "Which date is cheapest?"
  "Show cheaper dates"

SELECT_FLIGHT
- User selects one flight.

FLIGHT_DETAILS
- User asks details about a displayed flight.

START_BOOKING
- User wants to start booking.

CANCEL
- User wants to cancel the current interaction.

UNKNOWN
- Message cannot be mapped to any supported flight intent.

Return only the structured classification.
`;
}