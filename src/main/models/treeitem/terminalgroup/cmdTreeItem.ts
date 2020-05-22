import * as vscode from 'vscode';

export class CmdTreeItem extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly cmd: string,
        public readonly terminalName: string,
        public readonly dontexecute: boolean
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.tooltip = cmd;
        this.description = cmd;
    }

    contextValue = 'Cmd';
}