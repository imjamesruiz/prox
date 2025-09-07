import { supabase } from "./db.js"

async function seedUsers() {
  const { error } = await supabase.from("users").insert([
    {
      name: "Sarah Chen",
      email: "sarah.test@example.com",
      preferred_retailers: ["Whole Foods", "Sprouts"]
    },
    {
      name: "Mike Rodriguez",
      email: "mike.test@example.com",
      preferred_retailers: ["Walmart", "Aldi", "Smart & Final"]
    },
    {
      name: "Emma Johnson",
      email: "emma.test@example.com",
      preferred_retailers: ["Ralphs", "Vons", "CVS"]
    }
  ])
  if (error) console.error("❌ Error seeding users:", error)
  else console.log("✅ Users seeded")
}

seedUsers()
