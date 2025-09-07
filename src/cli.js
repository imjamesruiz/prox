import { ingestDeals } from "./ingest.js"
import { sendWeeklyEmails } from "./email.js"

async function main() {
  console.log("Starting weekly deals job...")
  await ingestDeals()
  await sendWeeklyEmails()
  console.log("✅ Weekly deals job complete")
}

main().catch(err => {
  console.error("failed:", err)
  process.exit(1)
})
