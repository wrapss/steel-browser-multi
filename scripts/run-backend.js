const { spawn } = require("child_process");
const path = require("path");

const args = process.argv.slice(2);
console.log("args", args);

// Set default values
let port = "3000";
let cdpPort = "9222";

// Parse args assuming direct values
if (args.length >= 2) {
  port = args[0];
  cdpPort = args[1];
}

console.log("port", port);
console.log("cdpPort", cdpPort);

const env = {
  ...process.env,
  PORT: port,
  CDP_REDIRECT_PORT: cdpPort,
};

const apiPath = path.join(__dirname, "..", "api");
const child = spawn("npm", ["run", "dev"], {
  cwd: apiPath,
  env,
  stdio: "inherit",
  shell: true,
});

child.on("error", (error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});

child.on("exit", (code) => {
  process.exit(code);
});
