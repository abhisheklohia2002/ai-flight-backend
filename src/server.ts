import {
  app,
} from "./app.js";

import {
  env,
} from "./config/env.js";


import dns from "node:dns";

dns.setDefaultResultOrder(
  "ipv4first"
);

app.listen(
  env.PORT,
  () => {

    console.log(
      `Server running on http://localhost:${env.PORT}`
    );

  }
);