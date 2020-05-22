import * as vscode from 'vscode';
import { CmdTreeItem } from './cmdTreeItem';

export class CmdGroupTreeItem extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly cmds: CmdTreeItem[]
    ) {
        super(label, vscode.TreeItemCollapsibleState.Expanded);
    }

    contextValue = 'CmdGroup';
}