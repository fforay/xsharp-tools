// src/commands/runCommand.ts
import * as vscode from 'vscode';
import { exec } from 'child_process';

import { parseBuildErrors } from '../utils/parseErrors';
import { diagnosticCollection } from '../extension';
import { findProjectFile } from '../utils/findProject';
import * as path from 'path';

let xsharpRunTerminal: vscode.Terminal | undefined;

export function registerRunCommand(context: vscode.ExtensionContext) {

  // Command : runProject
  const runCommand = vscode.commands.registerCommand('xsharp.runProject', async () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage('No Folder open.');
      return;
    }
    vscode.workspace.saveAll();

    const projectFile = await findProjectFile(); //workspaceFolders[0].uri.fsPath;
    if (!projectFile) {
      return;
    }
    const cwd = path.dirname(projectFile.fsPath);

    vscode.window.showInformationMessage('Compiling XSharp project…');

    exec('dotnet build', { cwd }, (error, stdout, stderr) => {
      diagnosticCollection.clear();
      parseBuildErrors(stdout); // Parsing errors from stdout

      if (error) {
        vscode.window.showErrorMessage('Errors compiling XSharp project. Running cancelled');
        return;
      }

      vscode.window.showInformationMessage("Compiling XSharp Project successfull. Running app…");

      // Creat or ReUse terminal
      if (!xsharpRunTerminal || xsharpRunTerminal.exitStatus !== undefined) {
        xsharpRunTerminal = vscode.window.createTerminal({
          name: 'XSharp Application',
          cwd: cwd
        });
      }
      xsharpRunTerminal.show();
      xsharpRunTerminal.sendText('dotnet run');
    });
  });

  context.subscriptions.push(runCommand);
}
