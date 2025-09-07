import { Resend } from "resend"
import "dotenv/config"

const resend = new Resend(process.env.RESEND_API_KEY)

async function test() {
  await resend.emails.send({
    from: "Deals <onboarding@resend.dev>", 
    to: "imjamesruiz@gmail.com",
    subject: "Test Email",
    html: "<h1>Hello from Resend</h1>"
  })
  console.log("Test email sent")
}

test()
