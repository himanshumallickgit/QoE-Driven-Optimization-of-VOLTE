import pandas as pd

df = pd.read_csv(r"C:\Users\sudha\Desktop\p.csv") 
print(df.head())

latency = df["Time"].diff().mean()
print(f"Average Latency: {latency} ms")

jitter = df["Time"].diff().std()
print(f"Jitter: {jitter} ms")

expected_packets = len(df)
packet_loss = 1 - (len(df) / expected_packets)
print(f"Packet Loss: {packet_loss * 100:.2f}%")

qos_score = 100 - (latency.mean() / 5 + jitter.mean() + 20 * packet_loss)
qos_score = max(0, min(qos_score, 100))
print(f"Quality of Service (QoS) Score: {qos_score:.2f}/100")