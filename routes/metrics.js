const express = require("express");
const router = express.Router();
const Metric = require("../models/Metric");

// GET: Fetch latest QoE metrics
router.get("/", async (req, res) => {
    try {
        const latestMetrics = await Metric.find().sort({ timestamp: -1 }).limit(1);
        res.json(latestMetrics[0] || { latency: 0, jitter: 0, packetLoss: 0, mos: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST: Add new QoE data (for testing)
router.post("/", async (req, res) => {
    try {
        const newMetric = new Metric(req.body);
        await newMetric.save();
        res.status(201).json(newMetric);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
