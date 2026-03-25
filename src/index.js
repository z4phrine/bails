import chalk from 'chalk';

console.log(chalk.blueBright("Modified Baileys By Bian Official 🌟"));
console.log(chalk.cyanBright("Telegram : ") + chalk.whiteBright("https://t.me/phyrinee"));
console.log(chalk.greenBright("Whatsapp : ") + chalk.whiteBright("https://urli.info/1rs3d"));

import makeWASocket from "./socket/index.js";
export * from "./config/index.js";
export * from "./binary/index.js";
export * from "../proto/index.js";
export * from "./sync/index.js";
export * from "./store/index.js";
export * from "./utils/index.js";
export * from "./types/index.js";
export * from "./wam/index.js";
export { makeWASocket };
export default makeWASocket;
