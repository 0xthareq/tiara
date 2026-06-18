import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { config, isDemoMode } from "./src/config.js";
import { router } from "./src/routes/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.use("/api", router);

// Opsional: jika folder frontend/dist hasil build sudah ada, server ini
// otomatis ikut menyajikannya. Berguna untuk deployment satu server saja
// (jalankan "npm run build" di folder frontend, lalu cukup jalankan backend ini).
const frontendDist = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({ name: "TIARA API", status: "ok", demoMode: isDemoMode() });
  });
}

app.listen(config.port, () => {
  console.log(`\nTIARA backend berjalan di http://localhost:${config.port}`);
  if (isDemoMode()) {
    console.log("Mode: DEMO (data contoh) — isi .env dengan SPREADSHEET_ID & kredensial Google untuk data asli.\n");
  } else {
    console.log(`Mode: LIVE — membaca spreadsheet ${config.spreadsheetId}\n`);
  }
});
