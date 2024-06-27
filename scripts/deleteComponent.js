// deleteComponent.js

const fs = require('fs');
const path = require('path');
const { rimraf } = require('rimraf');

const [,, pathArg, componentName] = process.argv;

if (!pathArg || !componentName) {
  console.error('You must provide a path and a component name');
  process.exit(1);
}

const componentPath = path.join(process.cwd(), pathArg, componentName);

// Check if component exists
if (fs.existsSync(componentPath)) {
    // Since rimraf now returns a Promise, use async/await for cleaner syntax
    (async () => {
        try {
            await rimraf(componentPath);
            console.log(`Component ${componentName} deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting the component: ${error}`);
        }
    })();
} else {
    console.log('Component does not exist.');
}
