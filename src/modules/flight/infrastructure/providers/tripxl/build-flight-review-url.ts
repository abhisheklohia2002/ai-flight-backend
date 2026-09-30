interface BuildFlightReviewUrlInput {
  traceId: string;
  resultIndex: string;
  selectedItineraryId: string;

  origin: string;
  destination: string;
  departureDate: string;

  tripType: "ONE_WAY" | "ROUND_TRIP";

  adults: number;
  children: number;
  infants: number;

  cabinClass:
    | "ECONOMY"
    | "PREMIUM_ECONOMY"
    | "BUSINESS"
    | "FIRST";

  currency: string;

  fareBrand: string;
  isLcc: boolean;

  isInternational?: boolean;
}

const FLIGHT360_WEB_URL =
  "https://flight360-pc4y8.ondigitalocean.app";

function formatDate(
  date: string
): string {
  const [
    year,
    month,
    day,
  ] = date.split("-");

  if (
    !year ||
    !month ||
    !day
  ) {
    throw new Error(
      `Invalid departure date: ${date}`
    );
  }

  return `${day}/${month}/${year}`;
}

function mapCabinClass(
  cabinClass:
    BuildFlightReviewUrlInput["cabinClass"]
): string {
  switch (cabinClass) {
    case "BUSINESS":
      return "B";

    case "FIRST":
      return "F";

    case "PREMIUM_ECONOMY":
      return "P";

    case "ECONOMY":
    default:
      return "E";
  }
}

export function buildFlightReviewUrl(
  input: BuildFlightReviewUrlInput
): string {
  const formattedDate =
    formatDate(
      input.departureDate
    );

  const itineraryId =
    `${input.origin}-${input.destination}-${formattedDate}`;

  const tripType =
    input.tripType ===
    "ROUND_TRIP"
      ? "R"
      : "O";

  const paxType =
    `A-${input.adults}_C-${input.children}_I-${input.infants}`;

  const cabinClass =
    mapCabinClass(
      input.cabinClass
    );

  const ctx = {
    traceId:
      input.traceId,

    resultIndex:
      input.resultIndex,

    selectedItineraryId:
      input.selectedItineraryId,

    journeyType:
      input.tripType,

    itineraryId,

    tripType,

    paxType,

    intl:
      input.isInternational ??
      false,

    cabinClass,

    fareBrand:
      input.fareBrand,

    isLcc:
      input.isLcc,

    issuedAt:
      Math.floor(
        Date.now() / 1000
      ),
  };

  /*
   * Base64 URL encoding:
   *
   * + becomes -
   * / becomes _
   * = padding removed
   */
  const encodedContext =
    Buffer
      .from(
        JSON.stringify(ctx),
        "utf8"
      )
      .toString("base64url");

  const params =
    new URLSearchParams();

  params.set(
    "itineraryId",
    itineraryId
  );

  params.set(
    "cur",
    input.currency
  );

  params.set(
    "ccde",
    "IN"
  );

  params.set(
    "ctx",
    encodedContext
  );

  return (
    `${FLIGHT360_WEB_URL}` +
    `/flight/review?${params.toString()}`
  );
}