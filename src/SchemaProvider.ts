import { CancellationToken, TextDocumentContentProvider, Uri } from "vscode";

export class SchemaProvider implements TextDocumentContentProvider {
    public provideTextDocumentContent(
        uri: Uri,
        token: CancellationToken
    ): string | undefined {
        if (uri.authority !== "schemas") {
            console.error(`Got an unrecognized internal request: ${uri}`);
            return undefined;
        }

        if (uri.path === "/main.schema.json") {
            let jsonSchema: any = {
                $schema: "http://json-schema.org/draft-07/schema",
                $id: "https://github.com/anticultist/vscode-json-ref-issue/tree/main/src/my.schema.json",
                type: "object",
                properties: {}
            };

            // const maxSubschemas = 58; // OK
            const maxSubschemas = 59; // endless loop
            for (let i = 1; i <= maxSubschemas; i++) {
                jsonSchema["properties"][`child-${i}`] = {
                    type: "object",
                    $ref: `./child-${i}.schema.json`
                };
            }

            console.log(`Serving request: ${uri}`);
            return JSON.stringify(jsonSchema);
        } else if (uri.path.startsWith("/child-")) {
            const subschemaNumber = uri.path.substring(7, uri.path.length - 12);

            let jsonSchema = {
                $schema: "http://json-schema.org/draft-07/schema",
                $id: `https://github.com/anticultist/vscode-json-ref-issue/tree/main/src/child-${subschemaNumber}.schema.json`,
                type: "object",
                properties: {
                    foo: {
                        type: "boolean",
                        description: "Lorem ipsum"
                    }
                }
            };
            console.log(`Serving request: ${uri}`);
            return JSON.stringify(jsonSchema);
        }

        console.error(`Got an unrecognized internal request: ${uri}`);
        return undefined;
    }
}
