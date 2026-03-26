const major = parseInt(process.versions.node.split('.')[0], 10);

if (major < 24) {
  console.error(
    '[Error] Node.js 24 is required to run the baileys\n' +
    'Current version is Node.js ' + process.versions.node + '.\n' +
    'Please upgrade to Node.js 24+ to proceed.\n'
  );
  process.exit(1);
}
