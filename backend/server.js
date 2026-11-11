const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/enit")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ Event Schema (matches your events.json structure)
const eventSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: String,
    date: String,
    category: String,
    image: String,
    description: String,
    themes: [String],
  },
  { collection: "events" }
);

const Event = mongoose.model("Event", eventSchema);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ API route: return all events
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ _id: -1 });
    res.json({ events });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
