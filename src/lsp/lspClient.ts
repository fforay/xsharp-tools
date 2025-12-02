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
    
    // --- 1. LSP Server ---
    const serverExe = context.asAbsolutePath(path.join('server', 'XSharpLanguageServer.exe'));

    const serverOptions: ServerOptions = {
        run: { command: serverExe, transport: TransportKind.stdio },
        debug: { command: serverExe, transport: TransportKind.stdio }
    };
    // 
    // --- 2. LSP Client ---
    
    // Filter documents for the client (only xsharp files )
    let clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'xsharp' }],
        synchronize: {
            // Notify the server about file changes to '.prg' files contained in the workspace
            fileEvents: workspace.createFileSystemWatcher('**/*.prg')
        }
    };

    // --- 3. Create and Start the Language Client ---

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