const { execSync } = require("child_process");

try {
  // Fetch all tags from the remote
  execSync("git fetch --tags");

  // Get a list of tags and filter for semantic versions
  const tags = execSync("git tag")
    .toString()
    .split("\n")
    .filter(tag => /^v\d+\.\d+\.\d+$/.test(tag));

  // Determine the latest tag
  let latestTag = tags.length > 0 ? tags.sort().pop() : "v0.0.0";

  // Split the version number into major, minor, and patch
  let [major, minor, patch] = latestTag.replace("v", "").split(".").map(Number);

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
