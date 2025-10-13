
import * as vscode from 'vscode';


export async function findProjectFile(): Promise<vscode.Uri | undefined> {
  const files = await vscode.workspace.findFiles('**/*.xsproj', '**/node_modules/**', 1);
  return files[0];
}
