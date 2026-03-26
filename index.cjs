/**
 * @z4phcode/z4ph.core — CJS Compatibility Wrapper
 * 
 * Supports BOTH CommonJS (require) and ESM (import) usage:
 *
 * ── ESM (native, recommended) ─────────────────────────────
 * import makeWASocket, { useMultiFileAuthState } from '@z4phcode/z4ph.core';
 *
 * ── CJS async (for require-based bots) ────────────────────
 * const { default: makeWASocket, useMultiFileAuthState } = await require('@z4phcode/z4ph.core');
 *
 * ── CJS with .then() ──────────────────────────────────────
 * require('@z4phcode/z4ph.core').then(({ default: makeWASocket, useMultiFileAuthState }) => {
 *   // your bot code here
 * });
 *
 * ── CJS top-level (classic pattern) ───────────────────────
 * const Baileys = require('@z4phcode/z4ph.core');
 * Baileys.then(async ({ default: makeWASocket, useMultiFileAuthState }) => {
 *   const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
 *   const sock = makeWASocket({ auth: state });
 *   sock.ev.on('creds.update', saveCreds);
 * });
 */
'use strict';

// Export a Promise that resolves to the ESM module
// This enables: const mod = await require('@z4phcode/z4ph.core')
module.exports = import('./src/index.js');
