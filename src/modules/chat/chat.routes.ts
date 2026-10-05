import {
  Router,
} from "express";

import {
  chatController,
  airportController,
  streamController,
} from "./chat.controller.js";


const router =
  Router();


router.post(
  "/chat",
  chatController
);

router.get("/airports", airportController);

router.post(
  "/stream",
  streamController
);


export default router;
