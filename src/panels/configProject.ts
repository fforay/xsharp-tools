


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
      <hr>
      <br><br>
      <label>
        <input type="checkbox" id="lateBinding" ${values.lateBinding === 'true' ? 'checked' : ''}>
        Allow Late Binding
      </label>
      <br><br>
      <label>
        <input type="checkbox" id="caseSensitive" ${values.caseSensitive === 'true' ? 'checked' : ''}>
        Case Sensitive
      </label>
      <br><br>
      <label>
        <input type="checkbox" id="zeroBasedArrays" ${values.zeroBasedArrays === 'true' ? 'checked' : ''}>
        Use Zero Based Arrays
      </label>
      <br><br>
      <label>
        <input type="checkbox" id="enforceSelf" ${values.enforceSelf === 'true' ? 'checked' : ''}>
        Enforce SELF
      </label>
      <br><br>
      <label>
        <input type="checkbox" id="allowDot" ${values.allowDot === 'true' ? 'checked' : ''}>
        Allow Dot for instance members
      </label>
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
          nullable: "${values.nullable}",
          lateBinding: "${values.lateBinding}",
          caseSensitive: "${values.caseSensitive}",
          zeroBasedArrays: "${values.zeroBasedArrays}",
          enforceSelf: "${values.enforceSelf}",
          allowDot: "${values.allowDot}"
        };
        vscode.setState(state);

        document.getElementById('reset').addEventListener('click', () => {
          document.getElementById('dialect').value = state.dialect;
          document.getElementById('outputType').value = state.outputType;
          document.getElementById('nullable').checked = state.nullable === 'enable';
          document.getElementById('lateBinding').checked = false;
          document.getElementById('caseSensitive').checked = false;
          document.getElementById('zeroBasedArrays').checked = false;
          document.getElementById('enforceSelf').checked = false;
          document.getElementById('allowDot').checked = false;
        });

        document.getElementById('save').addEventListener('click', () => {
          const dialect = document.getElementById('dialect').value;
          const outputType = document.getElementById('outputType').value;
          const lateBinding = document.getElementById('lateBinding').checked ? 'true' : 'false';
          const caseSensitive = document.getElementById('caseSensitive').checked ? 'true' : 'false';
          const zeroBasedArrays = document.getElementById('zeroBasedArrays').checked ? 'true' : 'false';
          const enforceSelf = document.getElementById('enforceSelf').checked ? 'true' : 'false';
          const allowDot = document.getElementById('allowDot').checked ? 'true' : 'false';
          const nullable = document.getElementById('nullable').checked ? 'enable' : 'disable';

          vscode.postMessage({
            command: 'saveSettings',
            values: { dialect, outputType, lateBinding, caseSensitive, zeroBasedArrays, enforceSelf, allowDot, nullable }
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