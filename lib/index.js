'use strict';

console.log(chalk.whiteBright("🌟 Modified Baileys By Bianoffc 🌟"));
console.log(chalk.whiteBright("Hi, thank you for using my modified baileys"));
console.log(chalk.yellowBright("Latest update version : ") + chalk.whiteBright(latestUpdate.toLocaleDateString()));
console.log(chalk.cyan("Telegram : ") + chalk.whiteBright("https://t.me/phyrine\n\n"));

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));

var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) {
        if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p)) {
            __createBinding(exports, m, p);
        }
    }
};

var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
};

Object.defineProperty(exports, '__esModule', { value: true });
exports.makeWASocket = exports.WAMessageHandler = void 0;

const Socket_1 = __importDefault(require('./Socket'));
const WAMessageHandler = require('./Socket/advanced-message-handler');
const makeWASocket = Socket_1.default;

exports.makeWASocket = makeWASocket;
exports.WAMessageHandler = WAMessageHandler;
exports.default = makeWASocket;

__exportStar(require('../WAProto'), exports);
__exportStar(require('./Utils'), exports);
__exportStar(require('./Types'), exports);
__exportStar(require('./Store'), exports);
__exportStar(require('./Defaults'), exports);
__exportStar(require('./WABinary'), exports);
__exportStar(require('./WAM'), exports);
__exportStar(require('./WAUSync'), exports);
