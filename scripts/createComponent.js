// createComponent.js
const { tsxContent, stylesContent, servicesContent, navigatorContent } = require('./componentTemplates');
const fs = require('fs');
const path = require('path');

function toCamelCase(str) {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+|-+/g, '');
}

const args = process.argv.slice(2);
const pathArg = args[0];
const rawComponentName = args[1];
const includeNavigator = args[2];

if (args.includes('--help')) {
  console.log(`
      Usage: npm run create-component <component/path> <ComponentName> [--include-navigator]
      
      Options:
        <component/path>          Relative rute where the new component will be created.
        <ComponentName>           Component name.
        --include-navigator       Includes a basic Stack.Navigator for this component (optional).
        --help                    Shows this help message.
  `);
  process.exit(0);
}

if (!pathArg || !rawComponentName) {
  console.error('You must provide a path and a component name');
  process.exit(1);
}

if(includeNavigator && includeNavigator !== '--include-navigator') {
  console.error('The only valid argument for the third parameter is "--include-navigator"');
  process.exit(1);
}

const componentName = toCamelCase(rawComponentName);
const componentPath = path.join(process.cwd(), pathArg, componentName);
const formattedComponentName = componentName.charAt(0).toUpperCase() + componentName.slice(1);

// Create directory
if (!fs.existsSync(componentPath)){
    fs.mkdirSync(componentPath, { recursive: true });
}

// File creation function
const createFile = (fileName, content) => {
  const fullFileName = `${formattedComponentName}${fileName ? `.${fileName}` : ''}.${fileName ? 'ts' : 'tsx'}`;
  fs.writeFileSync(path.join(componentPath, fullFileName), content(formattedComponentName));
}

// Create files
createFile('', tsxContent);
createFile('Styles', stylesContent);
createFile('Services', servicesContent);

if (includeNavigator === 'includeNavigator') {
  createFile('Navigator', navigatorContent);
  console.log(`Component ${formattedComponentName} created successfully with Navigator.`);
} else {
  console.log(`Component ${formattedComponentName} created successfully.`);
}
