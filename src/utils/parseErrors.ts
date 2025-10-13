import * as vscode from 'vscode';
import * as path from 'path';

import { diagnosticCollection } from '../extension';


export function parseBuildErrors(output: string) {
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
