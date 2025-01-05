const { execSync } = require("child_process");

try {
  // Fetch all tags from the remote repository
  execSync("git fetch --tags");

  // Get the latest tag
  let latestTag = execSync("git describe --tags --abbrev=0 || echo v0.0.0")
    .toString()
    .trim();

  // Split the version number into major, minor, and patch
  let [major, minor, patch] = latestTag.replace("v", "").split(".").map(Number);

  // Increment the patch version
  patch++;

  // Generate the new tag
  const newTag = `v${major}.${minor}.${patch}`;

  // Check if the new tag already exists
  const existingTags = execSync("git tag").toString().split("\n");
  if (existingTags.includes(newTag)) {
    console.error(`Tag ${newTag} already exists. Aborting.`);
    process.exit(1);
  }

  // Create and push the new tag
  console.log(`Creating new tag: ${newTag}`);
  execSync(`git tag ${newTag}`);
  execSync(`git push origin ${newTag}`);

  console.log("Tag pushed successfully!");
} catch (error) {
  console.error("Error creating tag:", error);
  process.exit(1);
}
