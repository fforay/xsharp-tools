// src/commands/runCommand.ts
import * as vscode from 'vscode';


export function registerOpenFolderCommand(context: vscode.ExtensionContext) {
    // Command : OpenFolder
    const disposable = vscode.commands.registerCommand(
        'xsharp.openFolderOfActiveFile',
        async () => {

            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage("No active file.");
                return;
            }

            const fileUri = editor.document.uri;
            const folderUri = vscode.Uri.joinPath(fileUri, "..");

            // Open folder in VSCode
            await vscode.commands.executeCommand(
                "vscode.openFolder",
                folderUri,
                false // false = open in the same window
            );
        }
    );

    context.subscriptions.push(disposable);

}