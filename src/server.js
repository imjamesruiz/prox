// src/server.js
import express from "express";
import { ingestDeals } from "./ingest.js";
import { sendWeeklyEmails } from "./email.js";
import { supabase } from "./db.js";
import path from "path";
import { fileURLToPath } from "url";
import { scrapeTargetDeals } from "./webScraper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));

// fetch
app.post("/ingest", async (req, res) => {
  try {
    await ingestDeals();
    res.json({ success: true, message: "Deals ingested" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// email
app.post("/send-emails", async (req, res) => {
  try {
    await sendWeeklyEmails();
    res.json({ success: true, message: "Emails sent" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// view deals
app.get("/api/deals", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .lte("start_date", today)
    .gte("end_date", today);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/scrape", async (req, res) => {
  try {
    const deals = await scrapeTargetDeals();
    res.json({ success: true, deals });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Prox dashboard running at http://localhost:3000");
});
