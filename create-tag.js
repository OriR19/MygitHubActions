const { execSync } = require("child_process");

// Get the latest tag
const latestTag = execSync("git describe --tags --abbrev=0 || echo v0.0.0")
  .toString()
  .trim();

// Split the version number into major, minor, and patch
const [major, minor, patch] = latestTag.replace("v", "").split(".").map(Number);

// Increment the patch version
const newTag = `v${major}.${minor}.${patch + 1}`;

// Create and push the new tag
console.log(`Creating new tag: ${newTag}`);
execSync(`git tag ${newTag}`);
execSync(`git push origin ${newTag}`);

console.log("Tag pushed successfully!");
