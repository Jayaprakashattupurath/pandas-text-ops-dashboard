const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());

const DATA_PATH = path.join(__dirname, "processed_tickets.json");

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/tickets", (_req, res) => {
  if (!fs.existsSync(DATA_PATH)) {
    return res.status(404).json({
      error: "processed_tickets.json not found. Run: python src/python/text_pipeline.py",
    });
  }
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  const data = JSON.parse(raw);
  res.json(data);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});