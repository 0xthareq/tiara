import express from "express";
import cors from "cors";
import { config, isDemoMode } from "./src/config.js";
import { router } from "./src/routes/index.js";

export const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.use("/api", router);

app.get("/", (req, res) => {
  res.json({ name: "TIARA API", status: "ok", demoMode: isDemoMode() });
});