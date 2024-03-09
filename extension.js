const vscode = require("vscode");
const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  const baseUrl = 'https://microsoftedge.github.io/Demos/json-dummy-data/64KB.json';

  try {
    const response = await axios.get(baseUrl);
    const jsonData = JSON.stringify(response.data, undefined, 4);

    // Save JSON data to a temporary file
    const tempFilePath = path.join(context.extensionPath, 'temp.json');
    fs.writeFileSync(tempFilePath, jsonData);

    // Open the temporary file
    vscode.workspace.openTextDocument(tempFilePath).then(doc => {
      vscode.window.showTextDocument(doc).then(() => {
        // Clean up temporary file after document is shown
        fs.unlinkSync(tempFilePath);
      }, error => {
        vscode.window.showErrorMessage('Failed to open temporary file: ' + error.message);
      });
    });
  } catch (error) {
    vscode.window.showErrorMessage('Failed to fetch and display JSON data: ' + error.message);
  }

  console.log('Congratulations, your extension "randomjsongenerator" is now active!');
  console.log("Hi");

  let disposable = vscode.commands.registerCommand(
    "randomjson.jsonGenerator",
    function () {
      vscode.window.showInformationMessage("Hello World from randomjsongenerator!");
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {
  console.log("Extension Deactivated");
}

module.exports = {
  activate,
  deactivate,
};
