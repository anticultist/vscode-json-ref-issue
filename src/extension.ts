import * as vscode from "vscode";

import { SchemaProvider } from "./SchemaProvider";

export function activate(context: vscode.ExtensionContext) {
    const schemaProvider = new SchemaProvider();
    context.subscriptions.push(
        vscode.workspace.registerTextDocumentContentProvider(
            "custom123",
            schemaProvider
        )
    );
}

export function deactivate() {}
