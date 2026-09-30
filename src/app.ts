import express from "express";
import cors from "cors";
import helmet from "helmet";

import chatRoutes from "./modules/chat/chat.routes.js";

export const app =
  express();


app.use(
  helmet()
);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
    ],

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);


app.use(
  express.json()
);

app.get(
  "/health",
  (_req, res) => {

    res.status(200).json({
      status: "ok",
    });
  }
);



app.use(
  "/api",
  chatRoutes
);