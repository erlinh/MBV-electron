/**
 * Configuration for electron-builder
 * This disables symlinks to solve permission issues on Windows
 */
module.exports = {
  appId: "com.mbv-electron",
  productName: "MBV Notes",
  files: [
    "dist/**/*",
    "electron.js",
    "src/main/**/*",
    "src/shared/**/*"
  ],
  directories: {
    buildResources: "assets",
    output: "release"
  },
  win: {
    target: "nsis"
  },
  mac: {
    target: "dmg"
  },
  linux: {
    target: "deb"
  },
  // Disable symlinks during build
  asar: true,
  npmRebuild: false,
  forceCodeSigning: false,
  electronDownload: {
    mirror: "https://github.com/electron/electron/releases/download/"
  }
}; 