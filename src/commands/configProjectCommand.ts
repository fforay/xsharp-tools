
import * as vscode from 'vscode';

import { findProjectFile } from '../utils/findProject';
import { xsProjReader } from '../utils/xsProjReader';
import { getConfigProjectHtml } from '../panels/configProject';

import { XMLParser, XMLBuilder } from 'fast-xml-parser';
/// Command : 
export function registerConfigProjectCommand(context: vscode.ExtensionContext) {

    const configureProjectCommand = vscode.commands.registerCommand('xsharp.configureProject', async () => {
        const panel = vscode.window.createWebviewPanel(
            'xsharpConfig',
            'Configure XSharp Project',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );
        const projectFile = await findProjectFile();
        if (!projectFile) {
            return;
        }
        const content = await vscode.workspace.fs.readFile(projectFile);
        const xmlText = Buffer.from(content).toString('utf8');
        const props = new xsProjReader(xmlText);
        const initialValues = {
            dialect: props.get('Dialect') ?? 'Core',
            outputType: props.get('OutputType') ?? 'Exe',
            nullable: props.get('Nullable') ?? 'disable'
        };


        panel.webview.html = getConfigProjectHtml(initialValues);

        panel.webview.onDidReceiveMessage(async message => {
            if (message.command === 'saveSettings') {
                const updatedXml = updateProjectXml(xmlText, message.values);
                await vscode.workspace.fs.writeFile(projectFile, Buffer.from(updatedXml, 'utf8'));
                vscode.window.showInformationMessage('Project settings saved.');
            }
        });

    });

    context.subscriptions.push(configureProjectCommand);

}

function updateProjectXml(xmlText: string, values: Record<string, string>): string {
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(xmlText);
    const group = parsed?.Project?.PropertyGroup;
    if (!group) {
        return xmlText;
    }
    group.Dialect = values.dialect;
    group.OutputType = values.outputType;
    group.Nullable = values.nullable;

    const builder = new XMLBuilder({ ignoreAttributes: false, format: true });
    return builder.build(parsed);
}


