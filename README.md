# Skiliket Dashboard

A modern web dashboard for the **Skiliket IoT System**, designed to visualize environmental data collected from distributed sensor nodes across the Metropolitan Zone of Guadalajara.
It provides **near real-time analytics**, historical insights, geographic heatmaps, and dataset exporting for research and environmental monitoring.

This dashboard is part of a larger architecture that includes IoT nodes (ESP32), a Raspberry Pi gateway, cloud storage (Supabase/PostgreSQL), and a machine learning pipeline.

---

## Features

### **Environmental Data Visualization**

* Near real-time data streaming from Supabase
* Historical charts with dynamic filtering
* Line charts, bar charts, and comparison views

### **Geographical Heatmap**

* 2D map built with OpenStreetMap
* Supports multiple sensor nodes
* Highlights CO₂, noise, UV, temperature, and humidity distributions

### **Data Tools**

* Download raw or cleaned datasets for custom analysis
* Access to materialized statistics computed in Supabase

### **Modern Web Stack**

* **Next.js 14 (App Router)**
* **React**
* **TailwindCSS**
* Integrated with **Supabase** for storage and authentication

---

## Repository Structure

```
public/
  images/…            # UI assets, logos, icons, illustrations

src/
  app/                # Route structure (admin, pages, layouts)
  components/         # Reusable UI components and chart modules
    charts/           # Line, bar, area, etc.
    maps/             # Map + heatmap components
    tables/           # Historical and aggregated views
    ui/               # Core UI utilities
  context/            # Global context providers
  database/           # Supabase client and DB utilities
  hooks/              # Custom hooks (queries, UI state, sync)
  icons/              # Icon components
  layout/             # Global page layout
```

---

## Architecture Overview

The dashboard connects directly to the cloud database, consuming:

* Cleaned and aggregated data produced by the gateway
* Materialized views for statistical summaries
* Simulation data (for ML validation) when available

All queries are strongly typed using the Supabase-generated types.

---

## Getting Started

### **1. Clone the repository**

```sh
git clone https://github.com/<your-username>/Skiliket-Dashboard.git
cd Skiliket-Dashboard
```

### **2. Install dependencies**

```sh
npm install
```

### **3. Add environment variables**

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### **4. Run the development server**

```sh
npm run dev
```

### **5. Build for production**

```sh
npm run build
npm start
```

---

## API / Database Integration

The dashboard uses the Supabase client for:

* Fetching environmental data
* Fetching statistical and temporal aggregates (materialized views)
* Authentication when used in admin mode

Backend integration is kept minimal to keep the frontend stateless and scalable.

---

## Deployment

The dashboard can be deployed to:

* **Vercel** (recommended)
* **Netlify**
* Any Node.js server

No server-side dependencies other than the Supabase client.

---

## Screenshots *(Optional: add images later)*

* Near real-time chart panels
* CO₂ heatmap
* Node comparison view
* Dataset explorer

---

## License

[MIT License.](./LICENSE)

---

## Part of the Skiliket IoT System

This dashboard is one component of a larger system that includes:

* Raspberry Pi gateway
* ESP32-based sensor nodes
* ML prediction pipeline
* Cloud architecture on Supabase

---

