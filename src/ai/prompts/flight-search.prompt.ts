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


PASSENGER RULES

Extract:

- adults
- children
- infants

Only extract passenger counts explicitly provided by the user.

Do NOT assume:

adults = 1
children = 0
infants = 0

unless the user actually provides those values.

Examples:

User:
"2 adults and 1 child"

Return:

adults = 2
children = 1
infants = null


User:
"2 adults, 1 child, no infant"

Return:

adults = 2
children = 1
infants = 0


User:
"1 adult"

Return:

adults = 1
children = null
infants = null


CABIN CLASS RULES

Allowed cabin classes:

ECONOMY
PREMIUM_ECONOMY
BUSINESS
FIRST

Examples:

"economy"
→ cabinClass = ECONOMY

"premium economy"
→ cabinClass = PREMIUM_ECONOMY

"business class"
→ cabinClass = BUSINESS

"first class"
→ cabinClass = FIRST

If the user does not mention cabin class:

cabinClass = null


TRIP TYPE RULES

If the user clearly asks for a return flight:

tripType = ROUND_TRIP

If clearly one-way:

tripType = ONE_WAY

Otherwise:

tripType = null


TIME PREFERENCES

morning
→ MORNING

afternoon
→ AFTERNOON

evening
→ EVENING

night
→ NIGHT


NON-STOP RULES

Examples:

"direct flight"
"non-stop only"

→ nonStopOnly = true


AIRLINE

If the user says:

"Only SpiceJet"

return the airline text in preferredAirline.

Do not invent airline codes.


PRICE

If the user says:

"under 5000"

extract:

maxPrice = 5000


IMPORTANT

Do not infer fields that the user did not provide.

Do not fill missing passenger values with defaults.

Do not fill cabin class with Economy automatically.

User message:

"${userMessage}"
`;
}