# XSharp Tools README

This is the README for the extension "XSharp Tools".  

The extension and its settings are available via the command palette of Visual Studio Code, or by ***Right-Clicking*** on a **.xsproj** file.  

## Features

- It offers commands and context menus to build and/or run XSharp projects from within Visual Studio Code by running the **dotnet build** and **dotnet run** commands.  
The project must be contained in a folder, and a file with the name of the folder with **.xsproj** extension will be the Project File.  
Be carefull that the **FolderName** and the **ProjectName** must be the same name, otherwise it will not work properly.  
The result of the build will appear in the *Problems* tab of Visual Studio Code.  
- You can define some settings for your **.xsproj** file (more to come)  



## Requirements

You must have the latest XSharp Language version installed.  
You can get it here : http://www.xsharp.eu  

It is good also to install the [X# Lang extension](https://marketplace.visualstudio.com/items?itemName=InfomindsAG.xsharp-lang) in order to have Syntax Highlighting.

## Extension Settings

Show Errors   : If true, show errors in the Problems Panel  
Show Warnings : If true, show warnings in the Problems panel  
GroupByFile   : Group Errors and Warnings by File.  

## Installation

Adapt with the current vsix filename.

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


### 0.1.0
Add settings for the X# Project.
### 0.2.0
Add settings for the extension
### 0.1.0
Initial release




**Enjoy!**
