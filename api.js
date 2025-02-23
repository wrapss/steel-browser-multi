import express from "express";
import { exec } from "child_process";

const app = express();

app.use(express.json());

const instances = new Map();

app.post("/browser", (req, res) => {
  const port = req.body.port;
  const cdp_port = req.body.cdp_port;

  if (!port || !cdp_port) {
    return res.status(400).json({ error: "Port and CDP port are required" });
  }

  const command = `npm run backend ${port} ${cdp_port}`;
  const process = exec(command);

  instances.set(port, process);

  res.json({
    status: "success",
    port,
    cdp_port,
  });
});

app.delete("/browser/:port", (req, res) => {
  const port = req.params.port;
  const process = instances.get(port);

  if (!process) {
    return res.status(404).json({ error: "Instance not found" });
  }

  process.kill();
  instances.delete(port);

  res.json({ status: "success" });
});

app.get("/browsers", (req, res) => {
  const activeInstances = Array.from(instances.keys()).map((port) => ({
    port,
  }));

  res.json(activeInstances);
});

const port = process.argv[2] || 3064;
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
