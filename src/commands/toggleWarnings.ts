
import * as vscode from 'vscode';


/// Command : 
export function registerToggleWarnings(context: vscode.ExtensionContext) {
    
      const statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
      statusItem.text = '$(filter) XSharp: Warnings ON';
      statusItem.tooltip = 'Click to toggle the display of warnings';
      statusItem.command = 'xsharp.toggleWarnings';
      statusItem.show();
      context.subscriptions.push(statusItem);
    
      const toggleWarningsCommand = vscode.commands.registerCommand('xsharp.toggleWarnings', () => {
        const config = vscode.workspace.getConfiguration('xsharp-tools');
        const current = config.get<boolean>('showWarnings', true);
        config.update('showWarnings', !current, vscode.ConfigurationTarget.Workspace);

        statusItem.text = `$(filter) XSharp: Warnings ${!current ? 'ON' : 'OFF'}`;
      });

}



