const vscode = require("vscode");
const fs = require('fs');
const path = require('path');

const sensibleKeyNames = [
  "name", "age", "address", "email", "phone",
  "city", "country", "occupation", "hobbies", "education"
];

const sensibleStringValues = [
  "John Doe", "Jane Smith", "Alice Johnson", "Bob Brown", "Michael Lee"
];

const sensibleNumberValues = [25, 30, 40, 50, 60];

function generateRealisticNestedJson(depth, maxKeys, maxArrayLength) {
  if (depth === 0) {
    const keyValuePairs = {};
    sensibleKeyNames.forEach(key => {
      keyValuePairs[key] = getRandomValueForKey(key);
    });
    return keyValuePairs;
  }

  const obj = {};
  const numKeys = Math.floor(Math.random() * maxKeys) + 1;

  for (let i = 0; i < numKeys; i++) {
    const key = getRandomKey();
    const randomType = Math.random();
    if (randomType < 0.7) {
      obj[key] = generateRealisticNestedJson(depth - 1, maxKeys, maxArrayLength);
    } else {
      const arrayLength = Math.floor(Math.random() * maxArrayLength) + 1;
      obj[key] = [];
      for (let j = 0; j < arrayLength; j++) {
        obj[key].push(generateRealisticNestedJson(depth - 1, maxKeys, maxArrayLength));
      }
    }
  }
  return obj;
}

function getRandomKey() {
  return sensibleKeyNames[Math.floor(Math.random() * sensibleKeyNames.length)];
}

function getRandomValueForKey(key) {
  switch (key) {
    case "name": return getRandomValue(sensibleStringValues);
    case "age": return getRandomValue(sensibleNumberValues);
    case "address": return `Address${Math.floor(Math.random() * 100)}`;
    case "email": return `email${Math.floor(Math.random() * 100)}@example.com`;
    case "phone": return `+1 (555) ${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    case "city": return `City${Math.floor(Math.random() * 100)}`;
    case "country": return `Country${Math.floor(Math.random() * 100)}`;
    case "occupation": return `Occupation${Math.floor(Math.random() * 100)}`;
    case "hobbies": return `Hobbies${Math.floor(Math.random() * 100)}`;
    case "education": return `Education${Math.floor(Math.random() * 100)}`;
    default: return null;
  }
}

function getRandomValue(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function activate(context) {
  try {
    const realisticNestedJson = generateRealisticNestedJson(3, 5, 5);
    const tempFilePath = path.join(context.extensionPath, 'temp.json');
    fs.writeFileSync(tempFilePath, JSON.stringify(realisticNestedJson, null, 2));

    vscode.workspace.openTextDocument(tempFilePath).then(doc => {
      vscode.window.showTextDocument(doc).then(() => {
        fs.unlinkSync(tempFilePath);
      }, error => {
        vscode.window.showErrorMessage('Failed to open temporary file: ' + error.message);
      });
    });
  } catch (error) {
    vscode.window.showErrorMessage('Failed to generate and display JSON data: ' + error.message);
  }

  console.log('Congratulations, your extension "randomjsongenerator" is now active!');

  let disposable = vscode.commands.registerCommand(
    "randomjson.jsonGenerator",
    function () {
      vscode.window.showInformationMessage("Hello World from randomjsongenerator!");
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {
  console.log("Extension Deactivated");
}

module.exports = {
  activate,
  deactivate,
};
