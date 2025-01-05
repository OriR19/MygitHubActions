const { execSync } = require("child_process");

try {
  // Fetch all tags from the remote
  execSync("git fetch --tags");

  // Get a list of tags that match semantic versioning
  const tags = execSync("git tag")
    .toString()
    .split("\n")
    .filter(tag => /^v\d+(\.\d+)*$/.test(tag));

  // Sort the tags and find the latest one
  const latestTag = tags.sort((a, b) => {
    const aParts = a.replace("v", "").split(".").map(Number);
    const bParts = b.replace("v", "").split(".").map(Number);
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aVal = aParts[i] || 0;
      const bVal = bParts[i] || 0;
      if (aVal !== bVal) return aVal - bVal;
    }
    return 0;
  }).pop();

  // Default to v0.0.0 if no tags are found
  let [major, minor = 0, patch = 0] = latestTag ? latestTag.replace("v", "").split(".").map(Number) : [0, 0, 0];

  // Increment the patch version
  patch++;

  // Generate the new tag
  const newTag = `v${major}.${minor}.${patch}`;

  // Create and push the new tag
  console.log(`Creating new tag: ${newTag}`);
  execSync(`git tag ${newTag}`);
  execSync(`git push origin ${newTag}`);

  console.log("Tag pushed successfully!");
} catch (error) {
  console.error("Error creating tag:", error);
  process.exit(1);
}
