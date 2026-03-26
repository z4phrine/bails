# @z4phcode/z4ph.core
**Modified Baileys WhatsApp Web Engine** — ESM + CJS Compatible

---

## 📦 Installation

```bash
npm install
# or
yarn install
```

---

## 🚀 Usage

### ✅ ESM (Native — Recommended)
```js
// bot.mjs  OR  bot.js  (if package.json has "type": "module")
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@z4phcode/z4ph.core';

const { state, saveCreds } = await useMultiFileAuthState('./auth_info');

const sock = makeWASocket({ auth: state });

sock.ev.on('creds.update', saveCreds);

sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
  if (connection === 'close') {
    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
    if (shouldReconnect) startBot();
  }
  if (connection === 'open') console.log('✅ Connected!');
});

sock.ev.on('messages.upsert', async ({ messages }) => {
  for (const msg of messages) {
    if (!msg.key.fromMe && msg.message?.conversation) {
      console.log('📨 Message:', msg.message.conversation);
      await sock.sendMessage(msg.key.remoteJid, { text: 'Hello!' });
    }
  }
});
```

### ✅ CJS (CommonJS — `require()` support)
```js
// bot.js  (if package.json has "type": "commonjs" or no type field)

// Pattern 1: top-level await (Node.js 14.8+, works in .mjs or with "type":"module")
const { default: makeWASocket, useMultiFileAuthState } = await require('@z4phcode/z4ph.core');

// Pattern 2: async wrapper (classic CJS bots)
require('@z4phcode/z4ph.core').then(async ({
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
}) => {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
  const sock = makeWASocket({ auth: state });
  sock.ev.on('creds.update', saveCreds);
  // ... rest of bot
});

// Pattern 3: dynamic import (works everywhere)
const { default: makeWASocket, useMultiFileAuthState } = await import('@z4phcode/z4ph.core');
```

### ✅ Using `form-data` in your bot
```js
import FormData from 'form-data';  // ESM
// or
const FormData = require('form-data');  // CJS
```

---

## ⚠️ Requirements
- **Node.js >= 18.0.0**
- `@z4phcode/libsignal` (custom package — must be installed separately if not on npm registry)

## 📦 Optional Dependencies
These are optional but needed for full features:
- `jimp` — image thumbnail generation
- `audio-decode` — audio waveform generation
- `link-preview-js` — link preview in messages
- `pino-pretty` — pretty logging in development

Install all optional:
```bash
npm install jimp audio-decode link-preview-js pino-pretty
```

---

## 🛠️ Troubleshooting

| Error | Fix |
|-------|-----|
| `Cannot find module 'form-data'` | `npm install form-data` |
| `Cannot find module 'chalk'` | `npm install chalk` |
| `Cannot find module 'jimp'` | `npm install jimp@^0.22.12` |
| `Cannot find module 'pino-pretty'` | `npm install pino-pretty` |
| `Cannot find module '@z4phcode/libsignal'` | Install from the custom registry or GitHub |
| ESM error in CJS project | Use `require('@z4phcode/z4ph.core').then(...)` pattern |

