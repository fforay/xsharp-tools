import * as vscode from 'vscode';
import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function registerLSPClient(context: vscode.ExtensionContext) {

    // LSP Server
    // 
    //const serverCommand = 'dotnet';
    // Path to XsharpLanguageServer.dll
    // const serverAssemblyPath = context.asAbsolutePath(path.join('server', 'XSharpLanguageServer.dll'));

    const serverExe = context.asAbsolutePath(path.join('server', 'XSharpLanguageServer.exe'));

    console.log('X# LSP Server : ' + serverExe);

    // // Options to launch the server in normal mode
    // let run: any = {
    //     command: serverCommand,
    //     args: [serverAssemblyPath] 
    // };

    // // Options to launch the server in DEBUG mode
    // let debug: any = {
    //     command: serverCommand,
    //     args: [serverAssemblyPath, '--debug'] 
    // };

    // // Options for the server
    // let serverOptions: ServerOptions = {
    //     run: run,
    //     debug: debug 
    // };

    const serverOptions: ServerOptions = {
        run: { command: serverExe, args: [""], transport: TransportKind.stdio },
        debug: { command: serverExe, args: [""],transport: TransportKind.stdio }
    };


    // 
    // LSP Client

    // Filter documents for the client (only xsharp files )
    let clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'xsharp' }],
        synchronize: {
            // Notify the server about file changes to '.prg' files contained in the workspace
            fileEvents: workspace.createFileSystemWatcher('**/*.prg')
        }
    };

    // Create and Start the Language Client

    client = new LanguageClient(
        'xsharpLanguageServer', // ID interne
        'X# Language Server',   // App Name
        serverOptions,
        clientOptions
    );

    // Start the client. This will also launch the server
    client.start();

    console.log('X# Language Server Client started.');
}

export function deactivateLSPClient(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}