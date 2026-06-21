import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import express from "express";
import { app } from "./app.js";
import { config, isDemoMode } from "./src/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const frontendDist = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

app.listen(config.port, () => {
  console.log(`\nTIARA backend berjalan di http://localhost:${config.port}`);
  if (isDemoMode()) {
    console.log("Mode: DEMO (data contoh) — isi .env dengan SPREADSHEET_ID_TRACER, SPREADSHEET_ID_PRESTASI & kredensial Google untuk data asli.\n");
  } else {
    console.log(`Mode: LIVE`);
    console.log(`  - Tracer Study : ${config.spreadsheetIds.tracerStudy}`);
    console.log(`  - Prestasi     : ${config.spreadsheetIds.prestasi}\n`);
  }
});