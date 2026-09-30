export function buildCalendarFarePrompt(
  userMessage: string
): string {

  return `
You extract calendar-fare search parameters from a flight-related user message.

User message:
"${userMessage}"

Rules:

1. Extract origin city/airport text exactly as understood.
2. Extract destination city/airport text.
3. Do NOT invent airport codes.
4. Keep dates as natural-language text.
5. Do NOT convert dates to YYYY-MM-DD.
6. If user provides a date range:
   - startDateText = starting date
   - endDateText = ending date
7. If user provides only one date:
   - startDateText = that date
   - endDateText = that date
8. If cabin class is not specified, return null.
9. Return null for information not present.

Examples:

User:
"Show cheaper fares from Delhi to Bangalore from 5 October to 8 October"

Result conceptually:
originText = "Delhi"
destinationText = "Bangalore"
startDateText = "5 October"
endDateText = "8 October"

User:
"Which fare is cheapest Delhi to Mumbai tomorrow"

Result:
originText = "Delhi"
destinationText = "Mumbai"
startDateText = "tomorrow"
endDateText = "tomorrow"
`;
}