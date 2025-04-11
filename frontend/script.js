document.addEventListener("DOMContentLoaded", function () {
    async function fetchQoEMetrics() {
        try {
            const response = await fetch("http://localhost:5000/api/qoe");
            const data = await response.json();

            if (data.length > 0) {
                const latestData = data[data.length - 1]; // Get the last entry
                
                document.getElementById("latency").textContent = `${latestData.latency} ms`;
                document.getElementById("jitter").textContent = `${latestData.jitter} ms`;
                document.getElementById("packetLoss").textContent = `${latestData.packetLoss} %`;
                document.getElementById("mos").textContent = latestData.mos.toFixed(2); // Fixed case

                updateChart(latestData); // Update chart with latest data
            }
        } catch (error) {
            console.error("❌ Error fetching data:", error);
        }
    }

    // Fetch data every 5 seconds
    setInterval(fetchQoEMetrics, 5000);
    
    async function submitQoEData(event) {
        event.preventDefault();

        const newData = {
            latency: parseFloat(document.getElementById("latencyInput").value),
            jitter: parseFloat(document.getElementById("jitterInput").value),
            packetLoss: parseFloat(document.getElementById("packetLossInput").value),
            mos: parseFloat(document.getElementById("mosInput").value), // Fixed case
        };

        console.log("🟢 Form Data Being Sent:", newData); // Debugging

        try {
            const response = await fetch("http://localhost:5000/api/qoe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newData),
            });

            if (response.ok) {
                alert("✅ Data submitted successfully!");
                fetchQoEMetrics(); // Refresh UI after submission
            } else {
                alert("❌ Error submitting data.");
            }
        } catch (error) {
            console.error("❌ Error:", error);
        }
    }

    document.getElementById("qoeForm").addEventListener("submit", submitQoEData);

    fetchQoEMetrics(); // Initial data fetch

    // Chart Initialization
    let qoeChart;

    function createChart() {
        const ctx = document.getElementById("qoeChart").getContext("2d");
        qoeChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: [],
                datasets: [
                    { label: "Latency (ms)", data: [], borderColor: "red", fill: false },
                    { label: "Jitter (ms)", data: [], borderColor: "blue", fill: false },
                    { label: "Packet Loss (%)", data: [], borderColor: "green", fill: false },
                    { label: "MOS", data: [], borderColor: "orange", fill: false }
                ]
            },
            options: {
                responsive: true,
                scales: { 
                    x: { title: { display: true, text: "Time" } }, 
                    y: { title: { display: true, text: "Value" } } 
                }
            }
        });
    }

    function updateChart(data) {
        const now = new Date().toLocaleTimeString();

        if (qoeChart) {
            qoeChart.data.labels.push(now);
            qoeChart.data.datasets[0].data.push(data.latency);
            qoeChart.data.datasets[1].data.push(data.jitter);
            qoeChart.data.datasets[2].data.push(data.packetLoss);
            qoeChart.data.datasets[3].data.push(data.mos); // Fixed case

            if (qoeChart.data.labels.length > 10) {
                qoeChart.data.labels.shift();
                qoeChart.data.datasets.forEach(dataset => dataset.data.shift());
            }

            qoeChart.update();
        }
    }

    // Initialize the chart
    createChart();
});
