'use strict';

/**
 * Pre-install check: enforce minimum Node.js version.
 * This file is executed automatically by npm/yarn before installation.
 */

const REQUIRED_MAJOR = 20;
const [major] = process.versions.node.split('.').map(Number);

if (major < REQUIRED_MAJOR) {
    process.stderr.write(
        `\n❌  Node.js ${REQUIRED_MAJOR}+ is required.\n` +
        `   Current version: ${process.versions.node}\n` +
        `   Please upgrade: https://nodejs.org/en/download\n\n`
    );
    process.exit(1);
}
