
import * as vscode from 'vscode';


// export async function findProjectFile(): Promise<vscode.Uri | undefined> {
//   const files = await vscode.workspace.findFiles('**/*.xsproj', '**/node_modules/**', 1);
//   return files[0];
// }
export async function findProjectFile(): Promise<vscode.Uri | null> {
  const files = await vscode.workspace.findFiles(
    '**/*.xsproj',
    '**/node_modules/**',
    1
  );

  if (!files || files.length === 0) {
    return null;
  }

  return files[0];
}
