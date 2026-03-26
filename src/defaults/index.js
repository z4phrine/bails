//=======================================================//
import { makeLibSignalRepository } from "../signal/libsignal.js";
import { Browsers } from "../utils/browserUtils.js";
import { proto } from "../../proto/index.js";
import logger from "../utils/logger.js";
//=======================================================//
// WhatsApp Web version — 2025 latest
export const version = [2, 3000, 1021040627];
export const DICT_VERSION = 3;
//=======================================================//
export const NOISE_WA_HEADER = Buffer.from([87, 65, 6, DICT_VERSION]);
export const CALL_VIDEO_PREFIX = "https://call.whatsapp.com/video/";
export const CALL_AUDIO_PREFIX = "https://call.whatsapp.com/voice/";
export const WA_ADV_HOSTED_ACCOUNT_SIG_PREFIX = Buffer.from([6, 5]);
export const WA_ADV_HOSTED_DEVICE_SIG_PREFIX  = Buffer.from([6, 6]);
export const NOISE_MODE = "Noise_XX_25519_AESGCM_SHA256\0\0\0\0";
export const WA_ADV_ACCOUNT_SIG_PREFIX = Buffer.from([6, 0]);
export const WA_ADV_DEVICE_SIG_PREFIX  = Buffer.from([6, 1]);
export const DEFAULT_ORIGIN = "https://web.whatsapp.com";
export const WA_DEFAULT_EPHEMERAL = 7 * 24 * 60 * 60;
export const UNAUTHORIZED_CODES = [401, 403, 419];
export const KEY_BUNDLE_TYPE = Buffer.from([5]);
export const PHONE_CONNECTION_CB = "CB:Pong";
export const DEF_CALLBACK_PREFIX = "CB:";
export const DEF_TAG_PREFIX = "TAG:";
//=======================================================//
export const URL_REGEX = /https:\/\/(?![^:@\/\s]+:[^:@\/\s]+@)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?/g;
//=======================================================//
export const WA_CERT_DETAILS = { SERIAL: 0 };
//=======================================================//
export const PROCESSABLE_HISTORY_TYPES = [
    proto.Message.HistorySyncNotification.HistorySyncType.INITIAL_BOOTSTRAP,
    proto.Message.HistorySyncNotification.HistorySyncType.PUSH_NAME,
    proto.Message.HistorySyncNotification.HistorySyncType.RECENT,
    proto.Message.HistorySyncNotification.HistorySyncType.FULL,
    proto.Message.HistorySyncNotification.HistorySyncType.ON_DEMAND,
    proto.Message.HistorySyncNotification.HistorySyncType.NON_BLOCKING_DATA,
    proto.Message.HistorySyncNotification.HistorySyncType.INITIAL_STATUS_V3
];
//=======================================================//
export const DEFAULT_CONNECTION_CONFIG = {
    // ── Core ─────────────────────────────────────────────────────────────────
    "version":                  version,
    "browser":                  Browsers.iOS("Safari"),
    "waWebSocketUrl":           "wss://web.whatsapp.com/ws/chat",
    // ── Timeouts & intervals ─────────────────────────────────────────────────
    "connectTimeoutMs":         30000,
    "keepAliveIntervalMs":      25000,
    "defaultQueryTimeoutMs":    60000,
    "qrTimeout":                45000,
    // ── Retry strategy ───────────────────────────────────────────────────────
    "retryRequestDelayMs":      350,
    "maxMsgRetryCount":         8,
    "transactionOpts":          { "maxCommitRetries": 15, "delayBetweenTriesMs": 2000 },
    // ── Logger ───────────────────────────────────────────────────────────────
    "logger":                   logger.child({ "class": "z4ph.core" }),
    // ── Behaviour flags ──────────────────────────────────────────────────────
    "emitOwnEvents":            true,
    "fireInitQueries":          true,
    "markOnlineOnConnect":      true,
    "syncFullHistory":          true,
    "generateHighQualityLinkPreview": true,
    "enableAutoSessionRecreation":    true,
    "enableRecentMessageCache":       true,
    // ── Media ────────────────────────────────────────────────────────────────
    "customUploadHosts":        [],
    "linkPreviewImageThumbnailWidth": 300,
    // ── Hooks (overrideable) ─────────────────────────────────────────────────
    "patchMessageBeforeSending":  (msg) => msg,
    "shouldSyncHistoryMessage":   () => true,
    "shouldIgnoreJid":            () => false,
    // ── Auth & crypto ────────────────────────────────────────────────────────
    "auth":                     undefined,
    "options":                  {},
    "appStateMacVerification":  { "patch": true, "snapshot": false },
    // ── Locale ───────────────────────────────────────────────────────────────
    "countryCode":              "ID",
    // ── Async resolvers ──────────────────────────────────────────────────────
    "getMessage":               async () => undefined,
    "cachedGroupMetadata":      async () => undefined,
    "makeSignalRepository":     makeLibSignalRepository
};
//=======================================================//
export const MEDIA_PATH_MAP = {
    "image":                "/mms/image",
    "video":                "/mms/video",
    "document":             "/mms/document",
    "audio":                "/mms/audio",
    "sticker":              "/mms/image",
    "thumbnail-link":       "/mms/image",
    "product-catalog-image":"/product/image",
    "md-app-state":         "",
    "md-msg-hist":          "/mms/md-app-state",
    "biz-cover-photo":      "/pps/biz-cover-photo"
};
//=======================================================//
export const MEDIA_HKDF_KEY_MAPPING = {
    "audio":                "Audio",
    "document":             "Document",
    "gif":                  "Video",
    "image":                "Image",
    "ppic":                 "",
    "product":              "Image",
    "ptt":                  "Audio",
    "sticker":              "Image",
    "video":                "Video",
    "thumbnail-document":   "Document Thumbnail",
    "thumbnail-image":      "Image Thumbnail",
    "thumbnail-video":      "Video Thumbnail",
    "thumbnail-link":       "Link Thumbnail",
    "md-msg-hist":          "History",
    "md-app-state":         "App State",
    "product-catalog-image":"",
    "payment-bg-image":     "Payment Background",
    "ptv":                  "Video",
    "biz-cover-photo":      "Image"
};
//=======================================================//
export const MEDIA_KEYS            = Object.keys(MEDIA_PATH_MAP);
export const MIN_PREKEY_COUNT      = 10;
export const INITIAL_PREKEY_COUNT  = 1024;
export const UPLOAD_TIMEOUT        = 45000;
export const MIN_UPLOAD_INTERVAL   = 3000;
export const DEFAULT_CACHE_TTLS = {
    SIGNAL_STORE:   10 * 60,
    MSG_RETRY:       2 * 60 * 60,
    CALL_OFFER:     10 * 60,
    USER_DEVICES:   10 * 60
};
//=======================================================//
  
