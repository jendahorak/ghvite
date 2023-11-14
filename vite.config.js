import { defineConfig } from 'vite';
import path from 'path';

// Get the current working directory (where Vite is executed)
const currentDirectory = process.cwd();

// Extract the project name from the folder name
const projectName = path.basename(currentDirectory);

export default defineConfig({
  base: `/${projectName}/`,
});
