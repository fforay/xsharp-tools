import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { Console } from 'console';


import { parseBuildErrors } from './utils/parseErrors';
import { registerBuildCommand } from './commands/buildCommand';
import { registerClearDiagnostics } from './commands/clearDiagnosticsCommand';
import { registerRunCommand } from './commands/runCommand';
import { registerToggleWarnings } from './commands/toggleWarnings';
import { registerSettingsPanelCommand } from './commands/settingsPanelCommand';
import { registerConfigProjectCommand } from './commands/configProjectCommand';
import { registerLSPClient } from './lsp/lspClient';
import { deactivateLSPClient } from './lsp/lspClient';
import { register } from 'module';

export let diagnosticCollection: vscode.DiagnosticCollection;


export function activate(context: vscode.ExtensionContext) {
  diagnosticCollection = vscode.languages.createDiagnosticCollection('xsharp');
  console.log('XSharp extension activated');

  registerBuildCommand(context);
  registerRunCommand(context);

  registerClearDiagnostics(context);

  registerToggleWarnings(context);

  registerSettingsPanelCommand(context);

  registerConfigProjectCommand(context);

  registerLSPClient(context);
}

export function deactivate() {
  diagnosticCollection.clear();
  diagnosticCollection.dispose();

  deactivateLSPClient();
}



