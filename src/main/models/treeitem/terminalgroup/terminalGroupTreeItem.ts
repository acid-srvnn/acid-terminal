import * as vscode from 'vscode';
import { TerminalTreeItem } from './terminalTreeItem';

export class TerminalGroupTreeItem extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly terminals: TerminalTreeItem[]
    ) {
        super(label, vscode.TreeItemCollapsibleState.Expanded);
    }

    contextValue = 'TerminalGroup';
}