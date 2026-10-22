import { Agent, fetch } from "undici";
import { env } from "../../../../../config/env.js";
import { SsrOptionsSchema, type SsrOptions } from "../../../../../ai/schemas/ssr-options.schema.js";
const dispatcher = new Agent({ connectTimeout: 60_000, headersTimeout: 90_000, bodyTimeout: 90_000 });
export async function getSsrOptions(input: { traceId: string; itineraryId: string; resultIndex: string }): Promise<SsrOptions> {
  const response = await fetch(`${env.TRIPXL_API_BASE_URL}${env.TRIPXL_SSR_OPTIONS_PATH}`, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json", "X-Access-Key": env.TRIPXL_ACCESS_KEY }, body: JSON.stringify({ traceId: input.traceId, selections: [{ itineraryId: input.itineraryId, resultIndex: input.resultIndex }], include: ["seats"] }), dispatcher });
  if (!response.ok) throw new Error(`TripXL SSR options failed: ${response.status} ${await response.text()}`);
  return SsrOptionsSchema.parse(await response.json());
}
