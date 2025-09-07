import { Resend } from "resend"
import { supabase } from "./db.js"

const resend = new Resend(process.env.RESEND_API_KEY)

function buildEmail(user, deals) {
  const userDeals = deals
    .filter(d => user.preferred_retailers.includes(d.retailer))
    .sort((a, b) => a.price - b.price)
    .slice(0, 6)

  if (userDeals.length === 0) return null

  const grouped = userDeals.reduce((acc, d) => {
    acc[d.retailer] = acc[d.retailer] || []
    acc[d.retailer].push(d)
    return acc
  }, {})

  let sections = ""
  for (const [retailer, items] of Object.entries(grouped)) {
    sections += `<h3 style="color:#0A4D3C;">${retailer}</h3><ul>`
    for (const d of items) {
      sections += `<li>${d.product} (${d.size}) - <b>$${d.price}</b> <br><small>${d.start_date} → ${d.end_date}</small></li>`
    }
    sections += "</ul>"
  }

  const html = `
    <div style="background:#F4FBF8;padding:20px;font-family:sans-serif;">
      <h1 style="color:#0FB872;">🛒 Prox Weekly Deals</h1>
      ${sections}
      <hr style="margin:20px 0;">
      <p style="font-size:12px;color:#555;">
        Manage your preferences: <a href="#">Click here</a><br>
        If you can't see this email, switch to plain text.
      </p>
    </div>
  `

  const text = userDeals
    .map(d => `${d.retailer}: ${d.product} (${d.size}) - $${d.price} (${d.start_date} → ${d.end_date})`)
    .join("\n")

  return { html, text }
}

export async function sendWeeklyEmails() {
  const today = new Date().toISOString().split("T")[0]

  // 1. Fetch current deals
  const { data: deals, error: dealsError } = await supabase
    .from("deals")
    .select("*")
    .lte("start_date", today)
    .gte("end_date", today)

  if (dealsError) {
    console.error("❌ Error fetching deals:", dealsError)
    return
  }

  console.log(`📦 Found ${deals.length} active deals`)

  // 2. Fetch users from Supabase
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("*")

  if (usersError) {
    console.error("❌ Error fetching users:", usersError)
    return
  }

  console.log(`👥 Found ${users.length} users`)

  // 3. Loop through users and send personalized emails
  for (const user of users) {
    const content = buildEmail(user, deals)
    if (!content) {
      console.log(`⚠️ No deals for ${user.email}`)
      continue
    }

    try {
      await resend.emails.send({
        from: "Deals <onboarding@resend.dev>", // change later to your domain
        to: user.email,
        subject: "Your Weekly Grocery Deals",
        html: content.html,
        text: content.text
      })
      console.log(`📧 Sent to ${user.email}`)
    } catch (err) {
      console.error(`❌ Failed to send to ${user.email}:`, err)
    }
  }
}

// // Run standalone for testing
// sendWeeklyEmails()

// email.js
if (import.meta.url === `file://${process.argv[1]}`) {
  sendWeeklyEmails()
}

