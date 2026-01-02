// src/commands/runCommand.ts
import * as vscode from 'vscode';
import { exec } from 'child_process';

import { parseBuildErrors } from '../utils/parseErrors';
import { diagnosticCollection } from '../extension';

let xsharpRunTerminal: vscode.Terminal | undefined;

export function registerRunCommand(context: vscode.ExtensionContext) {

  // Command : runProject
  const runCommand = vscode.commands.registerCommand('xsharp.runProject', () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage('No Folder open.');
      return;
    }
    vscode.workspace.saveAll();
    const cwd = workspaceFolders[0].uri.fsPath;

    vscode.window.showInformationMessage('Compiling XSharp project…');

    exec('dotnet build', { cwd }, (error, stdout, stderr) => {
      diagnosticCollection.clear();
      parseBuildErrors(stdout); // ← Ton parser existant

      if (error) {
        vscode.window.showErrorMessage('Errors compiling XSharp project. Running cancelled');
        return;
      }

      vscode.window.showInformationMessage("Compiling XSharp Project successfull. Running app…");

      // Créer ou réutiliser le terminal
      if (!xsharpRunTerminal || xsharpRunTerminal.exitStatus !== undefined) {
        xsharpRunTerminal = vscode.window.createTerminal({
          name: 'XSharp Application',
          cwd: cwd
        });
      }
      xsharpRunTerminal.show(true);
      xsharpRunTerminal.sendText('dotnet run');
    });
  });

  context.subscriptions.push(runCommand);
}
