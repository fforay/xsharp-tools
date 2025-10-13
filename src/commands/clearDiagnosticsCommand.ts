
import * as vscode from 'vscode';

import { diagnosticCollection } from '../extension';

/// Command : clearDiagnostics
export function registerClearDiagnostics(context: vscode.ExtensionContext) {
    const clearDiagnosticsCommand = vscode.commands.registerCommand('xsharp.clearDiagnostics', () => {
        diagnosticCollection.clear();
        vscode.window.showInformationMessage('XSharp problems cleared.');
    });

    context.subscriptions.push(clearDiagnosticsCommand);
}






