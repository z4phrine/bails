//=======================================================//
import { proto } from "../../proto/index.js";
import { platform, release } from "os";
//=======================================================//
// Browser platform IDs — updated 2025
const PLATFORM_MAP = {
    'Chrome': '133',
    'Edge':   '132',
    'Firefox':'134',
    'Opera':  '115',
    'Safari': '18'
};
//=======================================================//
export const Browsers = {
    iOS:     (browser) => ["ios",      browser, "18.3.2"],   // iOS 18.3.2
    ubuntu:  (browser) => ['Ubuntu',   browser, '24.04.1'],  // Ubuntu 24.04 LTS
    macOS:   (browser) => ['Mac OS',   browser, '15.3.2'],   // macOS Sequoia
    baileys: (browser) => ['Baileys',  browser, '8.0.8'],
    windows: (browser) => ['Windows',  browser, '10.0.26100'], // Win11 24H2
    android: (browser) => ['Android',  browser, '15.0'],
};
//=======================================================//
export const getPlatformId = (browser) => {
    const platformType = proto.DeviceProps.PlatformType[browser.toUpperCase()];
    return platformType ? platformType.toString() : "1";
};
//=======================================================//
export const getNativeOsFingerprint = () => {
    const os = platform();
    if (os === 'darwin') return ['Mac OS',  'Desktop', '15.3.2'];
    if (os === 'win32')  return ['Windows', 'Desktop', '10.0.26100'];
    return                      ['Ubuntu',  'Desktop', '24.04.1'];
};
//=======================================================//
