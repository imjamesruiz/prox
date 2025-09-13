import { supabase } from "./db.js";

async function clearDeals() {
  const { error } = await supabase.from("deals").delete().neq("id", 0);
  if (error) {
    console.error("Failed to clear deals:", error);
  } else {
    console.log("✅ Cleared all deals");
  }
}

clearDeals();
