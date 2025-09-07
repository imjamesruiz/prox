import { readFileSync } from "fs"
import { supabase } from "./db.js"

// load deals.json
const deals = JSON.parse(
  readFileSync(new URL("../deals.json", import.meta.url))
)

export async function ingestDeals() {
  console.log("Starting ingestion...")

  for (const d of deals) {
    console.log(`Processing: ${d.retailer} - ${d.product}`)

    const { data: existing, error: selectError } = await supabase
      .from("deals")
      .select("id")
      .eq("retailer", d.retailer)
      .eq("product", d.product)
      .eq("start_date", d.start)
      .maybeSingle()

    if (selectError) {
      console.error("❌ Select error:", selectError)
      continue
    }

    if (!existing) {
      const { error: insertError } = await supabase.from("deals").insert({
        retailer: d.retailer,
        product: d.product,
        size: d.size,
        price: d.price,
        start_date: d.start,
        end_date: d.end,
        category: d.category
      })

      if (insertError) {
        console.error("❌ Insert error:", insertError)
      } else {
        console.log(`✅ Inserted: ${d.retailer} - ${d.product}`)
      }
    } else {
      console.log(`⚠️ Skipped duplicate: ${d.retailer} - ${d.product}`)
    }
  }

  console.log("🎉 Deals ingestion complete")
}

// if script fully executed run function
if (import.meta.url === `file://${process.argv[1]}`) {
  ingestDeals().catch(err => {
    console.error("❌ Ingestion failed:", err)
  })
}


