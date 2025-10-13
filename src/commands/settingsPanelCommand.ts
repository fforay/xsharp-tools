
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

        panel.webview.html = getSettingsPanelHtml();

        panel.webview.onDidReceiveMessage(message => {
            const config = vscode.workspace.getConfiguration('XSharp BV.xsharp-tools');
            config.update(message.setting, message.value, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`Setting "${message.setting}" updated : ${message.value ? 'ON' : 'OFF'}`);
        });
    });



    context.subscriptions.push(settingsPanelCommand);


}

