//=======================================================//
import P from "pino";
//=======================================================//
export default P({
    level: process.env.LOG_LEVEL || "silent",
    timestamp: P.stdTimeFunctions.isoTime,
    transport: process.env.NODE_ENV !== "production"
        ? { target: "pino-pretty", options: { colorize: true, ignore: "pid,hostname" } }
        : undefined,
    formatters: {
        level: (label) => ({ level: label.toUpperCase() })
    }
});
//=======================================================//
