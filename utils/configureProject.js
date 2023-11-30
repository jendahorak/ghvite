import { exec } from "child_process";
import { updateProjectName, updateHomepage } from "./updateMetadata.js";
import fs from "fs";
import axios from "axios";

function getCurrentDirectory() {
  return new Promise((resolve, reject) => {
    exec("git rev-parse --show-toplevel", (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

function getRemoteRepoName() {
  return new Promise((resolve, reject) => {
    exec("git remote get-url origin", (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        const repoUrl = stdout.trim();
        const repoName = repoUrl.split("/").pop().replace(".git", "");
        resolve(repoName);
      }
    });
  });
}

function getRemoteRepoDetails() {
  return new Promise((resolve, reject) => {
    exec("git remote get-url origin", (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        const repoUrl = stdout.trim();
        const urlParts = repoUrl.split("/");
        const repoName = urlParts.pop().replace(".git", "");
        const username = urlParts.pop();
        resolve({ username, repoName });
      }
    });
  });
}

async function updateReadme() {
  try {
    const { username, repoName } = await getRemoteRepoDetails();
    const url = `https://api.github.com/repos/${username}/${repoName}`;

    const response = await axios.get(url, {
      headers: { "User-Agent": "node.js" },
    });

    const newDescription = `# ${repoName} \n${response.data.description}`;

    fs.writeFileSync("./README.md", newDescription);
    console.log("README.md has been updated");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function checkRepoName() {
  try {
    const currentDirectory = await getCurrentDirectory();
    const projectName = currentDirectory.split("/").pop();
    const remoteRepoName = await getRemoteRepoName();

    if (projectName === remoteRepoName) {
      console.log("Local and remote repository names match.");
      console.log("Updating package.json...");
      updateProjectName();
      updateHomepage();
    } else {
      console.error(
        "Local and remote repository names do not match. Please repair manualy."
      );
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

checkRepoName();
updateReadme();
