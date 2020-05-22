import * as vscode from 'vscode';
import { CmdTreeItem } from './cmdTreeItem';

export class TerminalTreeItem extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly cmds: CmdTreeItem[],
        public readonly path: string,
        public readonly cmd: string
    ) {
        super(label, vscode.TreeItemCollapsibleState.Expanded);
    }

    contextValue = 'Terminal';
}