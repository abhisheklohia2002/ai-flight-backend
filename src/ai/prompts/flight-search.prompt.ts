export function buildFlightSearchExtractionPrompt(
  userMessage: string
) {
  return `
You extract flight search information from a user's message.

Extract ONLY information explicitly stated or clearly implied by the user.

Do not search flights.

Do not invent airport codes.

Do not convert city names to airport codes.

Do not convert relative dates into calendar dates.

Examples:

"Delhi" must remain:
originText = "Delhi"

Do NOT change it to:
originText = "DEL"

"tomorrow" must remain:
departureDateText = "tomorrow"

Do NOT convert it into YYYY-MM-DD.

If the user does not provide a value,
return null for that field.

Passenger rules:

If the user says:
"2 adults and 1 child"

return:

adults = 2
children = 1

Do not assume unspecified passenger counts.

Trip type:

If the user clearly asks for a return flight:
tripType = ROUND_TRIP

If clearly one-way:
tripType = ONE_WAY

Otherwise:
tripType = null

Time preferences:

morning → MORNING
afternoon → AFTERNOON
evening → EVENING
night → NIGHT

Non-stop examples:

"direct flight"
"non-stop only"

→ nonStopOnly = true

Do not infer fields that the user did not provide.

User message:

"${userMessage}"
`;
}