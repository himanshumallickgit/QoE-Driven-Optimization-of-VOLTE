const mongoose = require("mongoose");

const MetricSchema = new mongoose.Schema({
    latency: Number,
    jitter: Number,
    packetLoss: Number,
    mos: Number,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Metric", MetricSchema);
