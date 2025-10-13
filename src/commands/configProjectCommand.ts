
import * as vscode from 'vscode';

import { getConfigProjectHtml } from '../panels/configProject';
import { findProjectFile } from '../utils/findProject';

/// Command : 
export function registerConfigProjectCommand(context: vscode.ExtensionContext) {

    const configureProjectCommand = vscode.commands.registerCommand('xsharp.configureProject', () => {
        const panel = vscode.window.createWebviewPanel(
            'xsharpConfig',
            'Configure XSharp Project',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.webview.html = getConfigProjectHtml();

        panel.webview.onDidReceiveMessage(async message => {
            if (message.setting === 'dialect') {
                const projectFile = await findProjectFile();
                if (!projectFile) {
                    vscode.window.showErrorMessage('Cannot find the project file');
                    return;
                }

                const xml = await vscode.workspace.fs.readFile(projectFile);
                const xmlText = Buffer.from(xml).toString('utf8');

                const updatedXml = xmlText.replace(
                    /<Dialect>.*<\/Dialect>/,
                    `<Dialect>${message.value}</Dialect>`
                );

                await vscode.workspace.fs.writeFile(projectFile, Buffer.from(updatedXml, 'utf8'));
                vscode.window.showInformationMessage(`Dialect updated : ${message.value}`);
            }
        });
    });

    context.subscriptions.push(configureProjectCommand);

}