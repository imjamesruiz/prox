import fetch from "node-fetch";

const TARGET_API_KEY = "9f36aeafbe60771e321a7cc95a78140772ab3e96"; 
const STORE_ID = "2151";  
const ZIP = "92617";

const TCINS = [
  "88414754","91963334","92045073",
  "93200681","94495770","94582707"
];

/**
 * scrape weekly deals from RedSky API
 * returns Promise<Array> arr of deal objects
 */
export async function scrapeTargetDeals() {
  const url =
    `https://redsky.target.com/redsky_aggregations/v1/web/product_summary_with_fulfillment_v1?` +
    `key=${TARGET_API_KEY}&tcins=${TCINS.join(",")}&store_id=${STORE_ID}&zip=${ZIP}&channel=WEB&page=%2Fweekly-ad`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json"
    }
  });

  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  const data = await res.json();

  return data.data.product_summaries.map(p => {
    const price =
      p.price?.formatted_current_price ??
      p.price?.formatted_price ??
      (p.price?.current_retail ? `$${p.price.current_retail}` : "N/A");

    return {
      retailer: "Target",
      product: p.item?.product_description?.title || "Unknown",
      size: p.item?.product_description?.downstream_description || "N/A",
      price,
      category: p.item?.primary_brand?.name || "misc",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    };
  });
}

// testing
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeTargetDeals()
    .then(deals => {
      console.log("Scraped Deals:", deals);
    })
    .catch(err => {
      console.error("Scraper failed:", err);
    });
}
