const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");  // Import CORS

const app = express();
app.use(cors());  // Enable CORS

app.use(express.json());

// Your MongoDB and routes setup here...

// Example Route for /api/qoe

const QoEMetricsSchema = new mongoose.Schema({
    latency: Number,
    jitter: Number,
    packetLoss: Number,
    mos: Number,
    timestamp: { type: Date, default: Date.now },
});

const QoEMetrics = mongoose.model("QoEMetrics", QoEMetricsSchema);


app.get("/api/qoe", async (req, res) => {
    try {
        const data = await QoEMetrics.find();
        res.json(data);
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        res.status(500).json({ error: "Error fetching data" }); // Return JSON error response
    }
});

app.post("/api/qoe", async (req, res) => {
    try {
        const newData = new QoEMetrics(req.body);
        await newData.save();
        res.status(201).json({ message: "Data saved successfully!" });
    } catch (error) {
        console.error("❌ Error saving data:", error);
        res.status(500).json({ error: "Error saving data" }); // Return JSON error response
    }
});


mongoose.connect("mongodb://localhost:27017/QoE_Project", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const port = 5000;
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
