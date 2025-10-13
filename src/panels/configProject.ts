



export function getConfigProjectHtml(): string {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: sans-serif; padding: 20px; }
        select { font-size: 1em; padding: 5px; }
      </style>
    </head>
    <body>
      <h2>Choose Dialect</h2>
      <select id="dialect">
        <option value="Core">Core</option>
        <option value="VisualObjects">VisualObjects</option>
        <option value="FoxPro">FoxPro</option>
        <option value="Harbour">Harbour</option>
        <option value="XBase">XBase</option>
      </select>

      <script>
        const vscode = acquireVsCodeApi();
        document.getElementById('dialect').addEventListener('change', e => {
          vscode.postMessage({ setting: 'dialect', value: e.target.value });
        });
      </script>
    </body>
    </html>
  `;
}
