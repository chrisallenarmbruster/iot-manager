// Be sure to set envirooonment variables for DOCKER_REGISTRY and DOCKER_IMAGE_NAME
// Set the defaultVersion variable below
// This is for a multi-arch build (linux/amd64,linux/arm64), but you can use a single arch if you want
// Be sure to update the tag to the version you want to build.
// This multi-arch build will build assumes you've already setup docker buildx.  i.e.:
// 'docker buildx create --name mybuilder --driver docker-container --bootstrap' and then
// 'docker buildx use mybuilder'

const defaultVersion = "2.1.0"; // Set default version here

require("dotenv").config();
const { spawn } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, { stdio: "inherit" });

    childProcess.on("error", (error) => {
      reject(error);
    });

    childProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Command exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

rl.question(
  `\nEnter the version to tag the image with (default: ${defaultVersion}): `,
  (inputVersion) => {
    const VERSION = inputVersion || defaultVersion;
    const imageName = `${process.env.DOCKER_REGISTRY}/${process.env.DOCKER_IMAGE_NAME}:${VERSION}`;

    rl.question(`Use cache, y or n (default: y): `, async (useCache) => {
      const cacheOption = useCache.toLowerCase() === "n" ? "--no-cache" : "";

      try {
        console.log("\nBuilding Docker image...");

        const args = ["buildx", "build"];
        if (cacheOption) {
          args.push(cacheOption);
        }
        args.push(
          "--platform",
          "linux/amd64,linux/arm64,linux/arm/v7",
          "-t",
          imageName,
          "."
        );

        await runCommand("docker", args);
        console.log(
          `\nDocker image built successfully and stored in build cache: ${imageName}`
        );

        console.log(
          `\nPushing Docker image based on cached build to ${process.env.DOCKER_REGISTRY}...`
        );
        await runCommand(`docker`, [
          "buildx",
          "build",
          "--platform",
          "linux/amd64,linux/arm64,linux/arm/v7",
          "-t",
          imageName,
          "--push",
          ".",
        ]);
        console.log(
          `\nDocker image pushed successfully to ${process.env.DOCKER_REGISTRY} as ${process.env.DOCKER_IMAGE_NAME}:${VERSION}\n`
        );
      } catch (error) {
        console.error("\nError occurred:\n", error);
        return;
      } finally {
        rl.close();
      }
    });
  }
);
