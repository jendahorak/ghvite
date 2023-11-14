import { execSync } from 'child_process';
import path from 'path';

import { readFileSync, writeFileSync } from 'fs';

function updateProperty(key, val) {
  const packageJsonPath = './package.json';
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

  if (packageJson[`${key}`] != val) {
    packageJson[`${key}`] = val;
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`Updated ${key} property in package.json to: ${val}`);
  } else {
    console.log(`Property ${key} is same as ${val}`);
  }
}

export { updateProperty };

function updateProjectName() {
  // Extract the project name from the folder name
  const projectName = path.basename(process.cwd());
  updateProperty('name', projectName);
}

function updateHomepage() {
  // Get the remote repository URL
  const remoteUrl = execSync('git config --get remote.origin.url').toString().trim();

  // Remove the ".git" extension and add a trailing "/"
  const correctedHomepage = remoteUrl.replace(/\.git$/, '') + '/';

  updateProperty('homepage', correctedHomepage);
}

export { updateHomepage, updateProjectName };
