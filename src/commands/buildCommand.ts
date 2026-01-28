// src/commands/runCommand.ts
import * as vscode from 'vscode';
import { exec } from 'child_process';

import { parseBuildErrors } from '../utils/parseErrors';
import { diagnosticCollection } from '../extension';
import { findProjectFile } from '../utils/findProject';
import * as path from 'path';

export function registerBuildCommand(context: vscode.ExtensionContext) {
  // Command : buildProject
  const buildCommand = vscode.commands.registerCommand('xsharp.buildProject', async () => {
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

    console.log('→ dotnet build started');

    exec('dotnet build', { cwd }, (error, stdout, stderr) => {
      diagnosticCollection.clear();
      parseBuildErrors(stdout);

      if (error) {
        vscode.window.showErrorMessage('Errors compiling XSharp project.');
        return;
      }

      vscode.window.showInformationMessage('Compiling XSharp Project successfull.');
      console.log(stdout);
    });
  });

  context.subscriptions.push(buildCommand);
}