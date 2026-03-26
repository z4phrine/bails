import chalk from 'chalk';
const latestUpdate = new Date("2026-03-26");

console.log(chalk.whiteBright("🌟 Modified Baileys By Bianoffc 🌟"));
console.log(chalk.whiteBright("Hi, thank you for using my modified baileys"));
console.log(chalk.yellowBright("Latest update version : ") + chalk.whiteBright(latestUpdate.toLocaleDateString()));
console.log(chalk.cyan("Telegram : ") + chalk.whiteBright("https://t.me/phyrine\n\n"));

import makeWASocket from "./socket/index.js";
export * from "./defaults/index.js";
export * from "./wabinary/index.js";
export * from "../proto/index.js";
export * from "./usync/index.js";
export * from "./store/index.js";
export * from "./utils/index.js";
export * from "./types/index.js";
export * from "./binary/index.js";
export { makeWASocket };
export default makeWASocket;
