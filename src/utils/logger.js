//=======================================================//
// Logger — pino with graceful fallback if pino-pretty is missing
//=======================================================//
import P from "pino";
//=======================================================//
let transport;
if (process.env.NODE_ENV !== "production") {
  try {
    // pino-pretty is optional — if missing, fall back to plain pino
    transport = { target: "pino-pretty", options: { colorize: true, ignore: "pid,hostname" } };
  } catch {
    transport = undefined;
  }
}
//=======================================================//
export default P({
  level: process.env.LOG_LEVEL || "silent",
  timestamp: P.stdTimeFunctions.isoTime,
  transport,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() })
  }
});
//=======================================================//
