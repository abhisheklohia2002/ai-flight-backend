import {
  Router,
} from "express";

import {
  chatController,
} from "./chat.controller.js";


const router =
  Router();


router.post(
  "/chat",
  chatController
);


export default router;