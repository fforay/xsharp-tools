
import * as vscode from 'vscode';

import { getSettingsPanelHtml } from '../panels/settingsPanel';


/// Command : 
export function registerSettingsPanelCommand(context: vscode.ExtensionContext) {

    // Command : settingsPanel
    const settingsPanelCommand = vscode.commands.registerCommand('xsharp.settingsPanel', () => {
        const panel = vscode.window.createWebviewPanel(
            'xsharpSettings',
            'XSharp Tools Settings',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        const config = vscode.workspace.getConfiguration('xsharp-tools');

        panel.webview.html = getSettingsPanelHtml(config);

        panel.webview.onDidReceiveMessage(
            async message => {
                await config.update(message.setting, message.value, vscode.ConfigurationTarget.Workspace);
                vscode.window.showInformationMessage(`Setting "${message.setting}" updated : ${message.value ? 'ON' : 'OFF'}`);
            },
            undefined,
            context.subscriptions
        );
    });



    context.subscriptions.push(settingsPanelCommand);


}

