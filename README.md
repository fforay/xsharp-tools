# XSharp Tools README

This is the README for the extension "XSharp Tools".

## Features

It offers commands and context menus to build and/or run XSharp projects from within Visual Studio Code.  
The project must be contained in a folder, and a file with the name of the folder with **.xsproj** extension will be the Project File.  

Be carefull that the **FolderName** and the **ProjectName** must be the same name, otherwise it will not work properly.  

## Requirements

You must have the latest XSharp Language version installed.  
You can get it here : http://www.xsharp.eu  

It is good also to install the [X# Lang extension](https://marketplace.visualstudio.com/items?itemName=InfomindsAG.xsharp-lang) in order to have Syntax Highlighting.

## Extension Settings

Show Errors   : If true, show errors in the Problems Panel  
Show Warnings : If true, show warnings in the Problems panel  
GroupByFile   : Group Errors and Warnings by File.  

## Installation

Adapt with the right vsix filename.

From the CLI, run:   
code --install-extension xsharp-tools-0.1.0.vsix

From VSCode
- Press Ctrl+Shift+P
- Type : Extensions: Install from VSIX
- Select the .vsix file in the explorer

## Compile & Package

Compile with :  
npm run compile

Create .vsix with :  
    vsce package


## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

### 0.1.0

Initial release




**Enjoy!**
