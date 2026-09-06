# Ocean Insight Globe

If you're using Lovable, Bolt, v0, Cursor, Claude Code, Windsurf, Replit Agent, or any AI IDE, use a prompt like this:

Sealens Landing Page Prompt

Create a premium, production-ready landing page for Sealens, an AI-powered Maritime Domain Awareness platform.

Design Style

Use a modern neo-minimalist grey aesthetic inspired by:

Apple

Linear

Vercel

Stripe

Palantir

Airbus Defense dashboards

Design language:

Light grey background (#ECECEC)

White glassmorphism cards

Soft shadows

Large typography

Minimal blue accents (#2563EB)

Thin borders

Smooth animations

Clean spacing

Premium enterprise SaaS feel

The page must look like a finalist product for Smart India Hackathon.

Layout

Use a two-column layout.

Left Side

Content changes based on scroll section.

Right Side

A persistent sticky animated globe.

The globe is the main storytelling element.

The globe should remain fixed while scrolling and transition through multiple states.

Style the globe as:

Flat 2D vector globe

Similar to Apple's Maps illustrations

Grey monochrome style

SVG-based

Lightweight

Smooth transitions

Rotates slowly

Zooms based on scroll progress

Hero Section

Title:

SEALENS

Subtitle:

AI-Powered Maritime Domain Awareness

Headline:

See a Safer Ocean World

Description:

Sealens integrates Sentinel-1 SAR imagery, AIS feeds, and environmental intelligence to detect suspicious maritime activity, identify dark vessels, assess risks, and generate actionable maritime insights.

Buttons:

Explore Platform

Watch Demo

Metrics:

200M+ km² monitored

Real-time vessel tracking

AI-powered analytics

Globe State:

Global Earth view.

Show:

AIS routes

Ocean currents

Satellite orbit path

Section 2 — Multi-Source Inputs

Title:

Multi-Source Inputs

Description:

Combining diverse maritime datasets into a unified operational picture.

Cards:

Sentinel-1 SAR

AIS Vessel Feeds

Wind & Current Data

Environmental Data

Globe Animation:

Satellite beam scans ocean.

Show:

Satellite orbit

Scanning cone

Vessel markers

Section 3 — AI Processing & Detection

Title:

AI Processing & Detection

Workflow:

SAR Image
→ Noise Reduction
→ Vessel Extraction
→ Dark Vessel Detection

Globe Animation:

Zoom into Indian Ocean.

Highlight a vessel.

Show alert card:

Potential Dark Vessel Detected

Confidence: 92%

Display red detection marker.

Section 4 — AI Fusion & Analytics

Title:

AI Fusion & Analytics

Show animated flow:

Detection Data
AIS History
Weather Data
Ship History

↓

AI Fusion Engine

↓

Identity Probability
Drift Backtracking
Risk Assessment
Track Association

Globe Animation:

Show:

Vessel route

Historical track

Predicted path

Ocean current vectors

Display floating risk card:

Risk Score: 87%

Possible Illegal Activity

Section 5 — Actionable Intelligence

Title:

Actionable Intelligence

Create two cards:

MARPOL Forensic Dossier

Vessel Identity

Timeline

Evidence Package

Violation Assessment

C2 Intercept Map

Intercept Coordinates

Tactical Route

Command Network

Real-Time Vectoring

Globe Animation:

Zoom further.

Show:

Patrol vessel

Target vessel

Intercept route

Coordinate marker

Display ETA.

Animations

Use GSAP + ScrollTrigger.

Requirements:

Sticky globe

Scroll-driven transitions

Globe rotates continuously

Smooth zoom between sections

Cards fade in

Text slides in

SVG paths animate

Satellite scanning beam animation

Vessel route animation

Floating data cards

Parallax effects

Tech Stack

Use:

Next.js 15

TypeScript

Tailwind CSS

Framer Motion

GSAP ScrollTrigger

Lucide Icons

Structure components as:

components/
 ├─ GlobeScene.tsx
 ├─ HeroSection.tsx
 ├─ InputSection.tsx
 ├─ DetectionSection.tsx
 ├─ FusionSection.tsx
 ├─ IntelligenceSection.tsx
 ├─ Navbar.tsx
 └─ Footer.tsx

Make the final result look like a premium interactive product website where the globe visually narrates the entire Sealens workflow from data collection to vessel interception.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ba9e9adb-1e60-436f-b96e-f07514e97c9a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
