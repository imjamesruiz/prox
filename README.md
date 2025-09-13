Weekly Deals → Email Automation

Prox is a backend-focused project that ingests grocery store deals, stores them in a Supabase database, and automatically emails personalized “Weekly Deals” newsletters to users. It demonstrates data ingestion, filtering, email generation, and automation using modern developer tools.

Features

Database Modeling (Supabase) 
- deals table for retailer products, prices, and validity dates.
- users table for subscribers with preferred retailers.
- Deduplication logic ensures deals are only stored once.

Automated Ingestion
- Reads deals.json (or scraped JSON) and inserts into Supabase.
- Dedupe on (retailer + product + start_date).


Personalized Email Generation
- Uses Resend API for reliable email delivery.
  
Prox branding with colors:
- Primary: #0FB872
- Dark: #0A4D3C
- Background: #F4FBF8

Each user only sees deals from their preferred retailers.

Groups deals by retailer and sorts by lowest price (Top 6 deals).

Plain-text fallback included.

CLI Automation

One command runs everything:

npm run send:weekly


Pipeline:

Ingest deals into Supabase.

Fetch active deals for the week.

Generate branded HTML + text.

Send emails to test users.

Stretch Goals

Simple web scraper to fetch deals dynamically.

Scheduled runs (weekly cron job).

Web preview of deals page.

📂 Project Structure
prox/
│── deals.json           # sample weekly deals
│── users.json           # test user data (optional if not using DB)
│── src/
│   ├── db.js            # Supabase client
│   ├── ingest.js        # ingest deals.json into DB
│   ├── email.js         # generate + send weekly emails
│   ├── cli.js           # orchestrator (npm run send:weekly)
│   └── scraper.js       # stretch goal: scrape live retailer deals
│── .env                 # environment variables
│── package.json
│── README.md

⚙️ Setup
1. Clone & Install
git clone https://github.com/imjamesruiz/prox.git
cd prox
npm install

2. Configure Environment

Create a .env file:

SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-key
RESEND_API_KEY=your-resend-api-key

3. Create Tables (Supabase)

Run in SQL editor:

create table deals (
  id bigint generated always as identity primary key,
  retailer text not null,
  product text not null,
  size text,
  price numeric(6,2) not null,
  start_date date not null,
  end_date date not null,
  category text,
  inserted_at timestamp default now()
);

create table users (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text unique not null,
  preferred_retailers text[]
);

4. Seed Data
Insert test deals and users manually or with seed scripts:

node src/ingest.js
node src/seedUsers.js

5. Run Weekly Job
npm run send:weekly

Tech Stack

Supabase – Database & hosting

Node.js – Scripts & automation

Resend API – Transactional email delivery

Cheerio / Puppeteer – (Stretch) Scraping retailer deals

dotenv – Environment variables




Prox integrates with Target’s RedSky API to fetch weekly deals directly from Target. Instead of scraping raw HTML, it uses Target’s structured product API, which returns clean JSON data.

How It Works

Calls the RedSky product summary API with a list of tcins (Target Catalog Item Numbers).

Fetches product details including:

Retailer (Target)

Product name

Size/quantity

Current price

Valid date range

Category

Transforms the API response into the same format as deals.json.

The resulting JSON can be ingested into Supabase and emailed to users.

Example Command
node src/webScraper.js


Next Steps

With more time, this project could be extended to:


Allow users to sign up and manage preferences in-app.

Add cron-based automation (e.g. GitHub Actions or Supabase scheduled functions).

Improve scraper to support multiple retailers & categories.




License

MIT License © 2025 James Ruiz
