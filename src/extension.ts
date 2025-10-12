import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { Console } from 'console';

let diagnosticCollection: vscode.DiagnosticCollection;

export function activate(context: vscode.ExtensionContext) {
  diagnosticCollection = vscode.languages.createDiagnosticCollection('xsharp');
  console.log('XSharp extension activated');

  // Command : buildProject
  const buildCommand = vscode.commands.registerCommand('xsharp.buildProject', () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage('No Folder open.');
      return;
    }

    const cwd = workspaceFolders[0].uri.fsPath;
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

  /// Command : clearDiagnostics
  const clearDiagnosticsCommand = vscode.commands.registerCommand('xsharp.clearDiagnostics', () => {
    diagnosticCollection.clear();
    vscode.window.showInformationMessage('XSharp problems cleared.');
  });

  const openSettingsCommand = vscode.commands.registerCommand('xsharp.openSettings', () => {
    vscode.commands.executeCommand('workbench.action.openSettings', '@ext:XSharp BV');
  });


  let xsharpRunTerminal: vscode.Terminal | undefined;

  // Command : runProject
  const runCommand = vscode.commands.registerCommand('xsharp.runProject', () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage('No Folder open.');
      return;
    }

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


  const statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  statusItem.text = '$(filter) XSharp: Warnings ON';
  statusItem.tooltip = 'Click to toggle the display of warnings';
  statusItem.command = 'xsharp.toggleWarnings';
  statusItem.show();
  context.subscriptions.push(statusItem);

  const toggleWarningsCommand = vscode.commands.registerCommand('xsharp.toggleWarnings', () => {
    const config = vscode.workspace.getConfiguration('xsharp');
    const current = config.get<boolean>('showWarnings', true);
    config.update('showWarnings', !current, vscode.ConfigurationTarget.Global);

    statusItem.text = `$(filter) XSharp: Warnings ${!current ? 'ON' : 'OFF'}`;
  });

  // Command : settingsPanel
  const settingsPanelCommand = vscode.commands.registerCommand('xsharp.settingsPanel', () => {
    const panel = vscode.window.createWebviewPanel(
      'xsharpSettings',
      'XSharp Settings',
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    panel.webview.html = getSettingsHtml();

    panel.webview.onDidReceiveMessage(message => {
      const config = vscode.workspace.getConfiguration('xsharp');
      config.update(message.setting, message.value, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`Setting "${message.setting}" updated : ${message.value ? 'ON' : 'OFF'}`);
    });
  });


  context.subscriptions.push(buildCommand, runCommand, clearDiagnosticsCommand, settingsPanelCommand, diagnosticCollection);

}

function parseBuildErrors(output: string) {
  const diagnosticsMap: Map<string, vscode.Diagnostic[]> = new Map();
  const seenErrors = new Set<string>(); // ← Pour filtrer les doublons
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath ?? '';
  const config = vscode.workspace.getConfiguration('xsharp');
  const showErrors = config.get<boolean>('showErrors', true);
  const showWarnings = config.get<boolean>('showWarnings', true);
  const groupByFile = config.get<boolean>('groupByFile', true);

  const regex = /(.*\.prg)\((\d+),(\d+)\):\s*(error|warning)\s*(\w+):\s*(.*)/g;
  let match: RegExpExecArray | null;
  console.log('→ Analyse des erreurs de build');
  while ((match = regex.exec(output)) !== null) {
    const [_, filePathRaw, lineStr, colStr, severityStr, code, message] = match;
    const line = parseInt(lineStr, 10) - 1;
    const col = parseInt(colStr, 10) - 1;

    const severity = severityStr === 'error'
      ? vscode.DiagnosticSeverity.Error
      : vscode.DiagnosticSeverity.Warning;

    // Filtrage selon les paramètres
    if ((severity === vscode.DiagnosticSeverity.Error && !showErrors) ||
      (severity === vscode.DiagnosticSeverity.Warning && !showWarnings)) {
      continue;
    }

    const resolvedPath = path.resolve(workspaceRoot, filePathRaw);
    const normalizedPath = path.normalize(resolvedPath);
    //const uri = vscode.Uri.file(normalizedPath);

    // Clé unique pour éviter les doublons
    const errorKey = `${normalizedPath}:${line}:${col}:${code}:${message}`;
    console.log('→ Diagnostic:', errorKey);
    if (seenErrors.has(errorKey)) {
      continue;
    }
    seenErrors.add(errorKey);

    const range = new vscode.Range(line, col, line, col + 1);
    const diagnostic = new vscode.Diagnostic(range, `${code}: ${message}`, severity);
    diagnostic.code = code;

    if (!diagnosticsMap.has(normalizedPath)) {
      diagnosticsMap.set(normalizedPath, []);
    }
    diagnosticsMap.get(normalizedPath)?.push(diagnostic);
  }

  if (groupByFile) {
    diagnosticsMap.forEach((diags, file) => {
      diagnosticCollection.set(vscode.Uri.file(file), diags);
    });
  } else {
    const allDiagnostics: vscode.Diagnostic[] = [];
    diagnosticsMap.forEach(diags => allDiagnostics.push(...diags));

    const firstFile = Array.from(diagnosticsMap.keys())[0];
    const targetUri = vscode.Uri.file(firstFile);
    diagnosticCollection.set(targetUri, allDiagnostics);
  }

}


export function deactivate() {
  diagnosticCollection.clear();
  diagnosticCollection.dispose();
}

function getSettingsHtml(): string {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: sans-serif; padding: 20px; }
        h2 { color: #007acc; }
        label { display: block; margin: 10px 0; }
      </style>
    </head>
    <body>
      <h2>XSharp Tools Settings</h2>
      <label><input type="checkbox" id="errors" checked> Show Errors</label>
      <label><input type="checkbox" id="warnings" checked> Show Warnings</label>
      <label><input type="checkbox" id="grouping" checked> Group by file</label>

      <script>
        const vscode = acquireVsCodeApi();

        document.querySelectorAll('input[type=checkbox]').forEach(input => {
          input.addEventListener('change', () => {
            vscode.postMessage({
              setting: input.id === 'grouping' ? 'groupByFile' :
                       input.id === 'errors' ? 'showErrors' : 'showWarnings',
              value: input.checked
            });
          });
        });
      </script>
    </body>
    </html>
  `;
}
