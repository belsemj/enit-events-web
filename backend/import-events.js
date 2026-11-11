const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

async function main() {
  // Connect
  await mongoose.connect("mongodb://127.0.0.1:27017/enit");

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

  // Read events.json (one level above backend)
  const jsonPath = path.join(__dirname, "..", "events.json");
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const data = JSON.parse(raw);

  const events = Array.isArray(data) ? data : (data.events || []);
  if (!events.length) {
    console.log("❌ No events found in events.json");
    process.exit(1);
  }

  // Upsert each event by id (insert or update)
  for (const ev of events) {
    if (!ev.id) continue;
    await Event.updateOne({ id: ev.id }, { $set: ev }, { upsert: true });
  }

  console.log(`✅ Imported/updated ${events.length} events into MongoDB.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Import error:", err);
  process.exit(1);
});
