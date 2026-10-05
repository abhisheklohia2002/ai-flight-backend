import type {
  Request,
  Response,
} from "express";

import {
  searchAirportService,
} from "./application/search-airport.service.js";


export async function searchAirportsController(
  req: Request,
  res: Response
): Promise<void> {

  try {

    const search =
      typeof req.query.search ===
        "string"
        ? req.query.search.trim()
        : "";


    if (
      search.length < 2
    ) {

      res.status(200).json({
        success: true,

        airports: [],
      });

      return;
    }


    const airports =
      await searchAirportService
        .execute(
          search
        );


    res.status(200).json({
      success: true,

      airports,
    });

  } catch (error) {

    console.error(
      "Airport search error:",
      error
    );


    res.status(500).json({
      success: false,

      airports: [],

      message:
        "Unable to search airports right now.",
    });
  }
}