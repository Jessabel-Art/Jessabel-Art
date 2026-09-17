import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const port = process.env.PORT || "3000";
const host = process.env.HOST || "0.0.0.0";
const nextBin = fileURLToPath(new URL("./node_modules/next/dist/bin/next", import.meta.url));

const child = spawn(
  process.execPath,
  [nextBin, "start", "--hostname", host, "--port", String(port)],
  {
    cwd: process.cwd(),
    env: { ...process.env, PORT: port, HOST: host },
    stdio: "inherit",
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

child.on("error", (error) => {
  console.error("Failed to start Next.js server:", error);
  process.exit(1);
});
