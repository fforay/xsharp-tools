# XSharp Tools README

This is the README for the extension "XSharp Tools".  

The extension and its settings are available via the command palette of Visual Studio Code, or by ***Right-Clicking*** on a **.xsproj** file.  

## Features

- It offers commands and context menus to build and/or run XSharp projects from within Visual Studio Code by running the **dotnet build** and **dotnet run** commands.  
The project must be contained in a folder, and a file with the name of the folder with **.xsproj** extension will be the Project File.  
Be carefull that the **FolderName** and the **ProjectName** must be the same name, otherwise it will not work properly.  
The result of the build will appear in the *Problems* tab of Visual Studio Code.  
- You can define some settings for your **.xsproj** file (more to come)  

- Starting from Version 0.4.0, the package integrate a basic LSP Client that communicates with the xsharp-lsp-server. The installer (.vsix) will contain the XSharpLanguageServer.exe. If you want to build yourself, you will need to **build** that project and copy the **publish**ed result in the server folder.


## Requirements

You must have the latest XSharp Language version installed.  
You can get it here : http://www.xsharp.eu  

It is good also to install the [X# Lang extension](https://marketplace.visualstudio.com/items?itemName=InfomindsAG.xsharp-lang) in order to have Syntax Highlighting.

## Extension Settings

Show Errors   : If true, show errors in the Problems Panel  
Show Warnings : If true, show warnings in the Problems panel  
GroupByFile   : Group Errors and Warnings by File.  

## Hidden LSP Server settings

If you want to track down what the LSP Server is doing, you can log some of its work.  
- Go to the Extension installation folder (should be in C:/Users/"yourLogin"/.vscode/extension/xsharp bv.xsharp-tools.x.x.x)
- Go to src/lsp
- Open the lspClient.ts file
- Around lines 43, you should find the launch command.
- Fill the **args: [""]** to point to a temporary folder, like **args: ["C:/temp"]**
- Run VSCode. You should now have **XSharpLSPYYYYMMDD.log** file in that folder. It will contains some informations about the LSP Server work.

## Installation

Go to the [Releases](https://github.com/fforay/xsharp-tools/releases) and get the lastest **.vsix** file.  
Adapt the procedure with the current vsix filename.

From the CLI, run:   
code --install-extension xsharp-tools-0.1.0.vsix

From VSCode
- Press Ctrl+Shift+P
- Type : Extensions: Install from VSIX
- Select the .vsix file in the explorer

## Compile & Package the extension

Compile with :  
npm run compile

Create .vsix with :  
    vsce package


## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

### 0.4.0
Add LSP (Language Server Protocol) Client/Server for the X# language.
### 0.3.0
Add settings for the X# Project.
### 0.2.0
Add settings for the extension
### 0.1.0
Initial release


**Enjoy!**
