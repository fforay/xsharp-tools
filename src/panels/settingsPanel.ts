


export function getSettingsPanelHtml(): string {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: sans-serif; padding: 20px; }
        h2 { color: #007acc; }
        label { display: block; margin: 10px 0; }
      </style>
    </head>
    <body>
      <h2>XSharp Tools Settings</h2>
      <label><input type="checkbox" id="errors" checked> Show Errors</label>
      <label><input type="checkbox" id="warnings" checked> Show Warnings</label>
      <label><input type="checkbox" id="grouping" checked> Group by file</label>

      <script>
        const vscode = acquireVsCodeApi();

        document.querySelectorAll('input[type=checkbox]').forEach(input => {
          input.addEventListener('change', () => {
            vscode.postMessage({
              setting: input.id === 'grouping' ? 'groupByFile' :
                       input.id === 'errors' ? 'showErrors' : 'showWarnings',
              value: input.checked
            });
          });
        });
      </script>
    </body>
    </html>
  `;
}