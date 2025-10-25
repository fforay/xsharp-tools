


export function getConfigProjectHtml(values: Record<string, string>): string {
  return `
    <html>
    <body>
      <h2>XSharp Project Settings</h2>

      <label>Dialect:</label>
      <select id="dialect">
        ${renderOptions(['Core', 'VO', 'Vulcan', 'FoxPro', 'Harbour', 'XPP'], values.dialect)}
      </select>

      <br><br>
      <label>Output Type:</label>
      <select id="outputType">
        ${renderOptions(['Exe', 'Library'], values.outputType)}
      </select>

      <br><br>
      <label>
        <input type="checkbox" id="nullable" ${values.nullable === 'enable' ? 'checked' : ''}>
        Enable Nullable
      </label>

      <br><br>
      <button id="reset">Reset</button>
      <button id="save">Save</button>

      <script>
        const vscode = acquireVsCodeApi();
        const state = {
          dialect: "${values.dialect}",
          outputType: "${values.outputType}",
          nullable: "${values.nullable}"
        };
        vscode.setState(state);

        document.getElementById('reset').addEventListener('click', () => {
          document.getElementById('dialect').value = state.dialect;
          document.getElementById('outputType').value = state.outputType;
          document.getElementById('nullable').checked = state.nullable === 'enable';
        });

        document.getElementById('save').addEventListener('click', () => {
          const dialect = document.getElementById('dialect').value;
          const outputType = document.getElementById('outputType').value;
          const nullable = document.getElementById('nullable').checked ? 'enable' : 'disable';

          vscode.postMessage({
            command: 'saveSettings',
            values: { dialect, outputType, nullable }
          });
        });
      </script>
    </body>
    </html>
  `;
}

function renderOptions(options: string[], selected: string): string {
  return options.map(opt =>
    `<option value="${opt}"${opt === selected ? ' selected' : ''}>${opt}</option>`
  ).join('\n');
}