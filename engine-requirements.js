const major = parseInt(process.versions.node.split('.')[0], 10);

if (major < 20) {
  console.error(
    '[Error] Node.js 20+ is required to run baileys\n' +
    'Current version is Node.js ' + process.versions.node + '.\n' +
    'Please upgrade to Node.js 20+ to proceed.\n'
  );
  process.exit(1);
}
