import * as vscode from 'vscode';
import { DebugAdapterInlineImplementation } from 'vscode';
import {
    DebugSession,
    InitializedEvent,
    TerminatedEvent
} from '@vscode/debugadapter';

class XSharpDebugSession extends DebugSession {
    initializeRequest(response: any, args: any) {
        this.sendResponse(response);
        this.sendEvent(new InitializedEvent());
    }

    async launchRequest(response: any, args: any) {
        // ReUse Existing command to run the project
        await vscode.commands.executeCommand("xsharp.runProject");

        // and close
        this.sendEvent(new TerminatedEvent());
        this.sendResponse(response);
    }
}

export function registerDebugAdapter(context: vscode.ExtensionContext) {

    vscode.debug.registerDebugAdapterDescriptorFactory("xsharp", {
        createDebugAdapterDescriptor: () => {
            return new DebugAdapterInlineImplementation(new XSharpDebugSession());
        }
    });
}