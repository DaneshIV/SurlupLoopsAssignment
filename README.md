# 🚗 Car Painting Booking Automation System

## 🧩 Overview

The **Car Painting Booking Automation System** is an intelligent, end-to-end booking platform that allows customers to book car painting services directly through **WhatsApp**.  

This system connects **Twilio’s WhatsApp API**, **MongoDB**, **Next.js**, **Nodemailer**, and **Google Calendar API** — creating a seamless, automated flow from the moment a customer sends a message to final confirmation and scheduling.

The idea is simple:  
A customer messages your WhatsApp number → chooses a time slot → receives a confirmation email → the booking is automatically added to your **Google Calendar** → the **Admin Dashboard** updates live.  

---

## ⚙️ Technology Stack

| Layer | Technology | Description |
|:------|:------------|:-------------|
| Frontend | **Next.js 15**, **TailwindCSS**, **Framer Motion** | Interactive and modern dashboard interface |
| Backend | **Next.js API Routes (Node.js)** | Handles chat logic, database ops, and API calls |
| Database | **MongoDB + Mongoose** | Stores bookings and available time slots |
| Chat Automation | **Twilio WhatsApp API** | Enables WhatsApp messaging automation |
| Email Service | **Nodemailer + Gmail SMTP** | Sends booking confirmation emails |
| Calendar Integration | **Google Calendar API (Service Account)** | Syncs confirmed bookings to calendar |
| Deployment | **Vercel**, **ngrok** | Production hosting and local webhook testing |

---

---

## 🖼️ Tech Stack Preview

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/FramerMotion-EA4C89?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white" alt="Twilio" />
  <img src="https://img.shields.io/badge/Nodemailer-FFA500?style=for-the-badge&logo=gmail&logoColor=white" alt="Nodemailer" />
  <img src="https://img.shields.io/badge/Google%20Calendar-4285F4?style=for-the-badge&logo=googlecalendar&logoColor=white" alt="Google Calendar" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/ngrok-1F1E37?style=for-the-badge&logo=ngrok&logoColor=white" alt="ngrok" />
</p>

---

## 💬 Story Flow — How It Works

It all begins with a message.

When a customer sends **“Hi”**, the WhatsApp bot — powered by Twilio — replies with a friendly welcome:

> 👋 *Welcome to Danesh’s Car Painting Booking Bot!*  
>  
> 1️⃣ View available slots  
> 2️⃣ Help  

From here, the journey unfolds naturally.

### Step 1 — Viewing Available Slots
When the customer types **1**, the system fetches available time slots for **today and tomorrow** from MongoDB.  
If slots are available, they’re listed one by one with times and dates, allowing the customer to select the one they prefer.

### Step 2 — Booking Confirmation
The customer replies with the slot number (e.g., “2”).  
Behind the scenes:
- The selected slot is marked as **booked** in the database.  
- A new **Booking record** is created and saved.  
- A **confirmation email** is sent to the customer.  
- The event is automatically added to your **Google Calendar**.  

Finally, the bot replies with:
> ✅ *Your booking for [date] at [time] has been confirmed!*  
> 📧 *A confirmation email has been sent.*

### Step 3 — Admin Dashboard
The **Next.js Dashboard** provides a real-time overview:
- 📦 Total Bookings  
- 🕓 Available Slots  
- 📅 Today’s Bookings  
- 🧾 Recent Booking Details  

Every booking made through WhatsApp reflects instantly in the dashboard — giving administrators complete visibility over operations.

---

## 🧱 Data Structure

### `TimeSlot` Model
Stores All Available Time Slots.

```ts
{
  date: String,
  startTime: String,
  endTime: String,
  isBooked: Boolean,
  bookedBy: ObjectId (Booking)
}
```
### `Booking` Model
Tracks Customer Bookings

```ts
{
  clientName: String,
  email: String,
  whatsappNumber: String,
  date: String,
  timeSlot: ObjectId,
  status: String,
  createdAt: Date
}
```
---
## 🧰 Setup Instructions

1️⃣ Clone and Install

```bash
  git clone https://github.com/<your-username>/car-painting-booking.git
  cd car-painting-booking
  npm install
```
2️⃣ Configure Environment
Create a .env.local file in the project root and fill in your credentials:
```bash
  MONGODB_URI=
  TWILIO_ACCOUNT_SID=
  TWILIO_AUTH_TOKEN=
  TWILIO_WHATSAPP_NUMBER=
  EMAIL_USER=
  EMAIL_PASS=
  GOOGLE_CALENDAR_ID=
  GOOGLE_SERVICE_ACCOUNT_KEY=
```
> [!TIP]
> You can use the <code>.env.example</code> file as a template — it’s safe to push this version to GitHub since it doesn’t contain real keys.
---
▶️ Running the Application

Development Mode 
```bash
  npm run dev
```
Connecting WhatsApp (Twilio)
Use ngrok to tunnel your local server:
```bash
  ngrok http 3000
```
Then copy your forwarding URL into the Twilio Console → WhatsApp Sandbox → "When a message comes in" field, pointing it to:

```arduino
  https://<your-domain>.ngrok-free.app/api/whatsapp
```
----
## 🧩 System Architecture

```vbnet
      ┌────────────────────────┐
      │ WhatsApp User          │
      └──────────┬─────────────┘
                 │  (via Twilio API)
                 ▼
      ┌────────────────────────┐
      │ Next.js API (WhatsApp) │
      │ Handles chat logic      │
      └──────────┬─────────────┘
                 ▼
      ┌────────────────────────┐
      │ MongoDB (Mongoose)     │
      │ Bookings & TimeSlots   │
      └──────────┬─────────────┘
           ┌──────┴──────┐
           ▼             ▼
      ┌────────────┐   ┌────────────────────┐
      │ Nodemailer │   │ Google Calendar API│
      │ Send Email │   │ Create Event       │
      └────────────┘   └────────────────────┘
                 │
                 ▼
      ┌────────────────────────┐
      │ Next.js Dashboard UI   │
      │ View live status & data│
      └────────────────────────┘
```
----
## 🌟 Key Features
> ✅ WhatsApp-based booking system <br>
> ✅ Real-time MongoDB synchronization <br>
> ✅ Automated email confirmation <br>
> ✅ Google Calendar integration <br>
> ✅ Responsive admin dashboard <br>
> ✅ Scalable architecture for future add-ons <br>
---
## 🚀 Future Enhancements 
- Integrate Clerk / Auth.js for secure admin login
- Add Stripe for online deposits
- Introduce Socket.io for live dashboard updates
- Enable full CRUD for managing slots and bookings
---
## 🧑‍💻 Author  <br>
<p align="center">
  <b>Danesh Muthu Krisnan</b><br>
  🎓 Computer Science in Network & Security Student<br>
  💡 Built using <b>Next.js</b>, <b>MongoDB</b>, and <b>Twilio APIs</b>
</p>

---
---
📜 License
This project is open-source and available under the MIT License.
```yaml
This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.
```
---
<p align="center">
  <i>“DeckedOut”</i><br><br>
    <img src="https://i.imgur.com/wswO9vz.gif" width="800" alt="project gif"><br><br>
  <b>Made by Danesh Muthu Krisnan</b><br>
  © 2025 All Rights Reserved
</p>

