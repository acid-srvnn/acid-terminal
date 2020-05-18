import * as vscode from 'vscode';
import { DataProvider } from './dataProvider';
import path = require('path');

export class TerminalTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    dataProvider: DataProvider;

    constructor(param: DataProvider) {
        this.dataProvider = param;
    }

    public _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;

    getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: any): vscode.ProviderResult<any[]> {
        if (!element) {
            let terminalGroups = this.dataProvider.getConfig().terminalGroups;
            let ret: TerminalGroupTreeItem[] = [];
            terminalGroups.forEach(function (terminalGroup) {
                let terminals: TerminalTreeItem[] = [];
                terminalGroup.terminals.forEach(function (terminal) {
                    let cmds: CmdTreeItem[] = [];
                    terminal.cmds.forEach(function (cmd) {
                        cmds.push(new CmdTreeItem(cmd.name, cmd.cmd, terminal.name, cmd.dontexecute!));
                    });
                    terminals.push(new TerminalTreeItem(terminal.name, cmds, terminal.path ? terminal.path : ".", terminal.cmd ? terminal.cmd : ""));
                });
                ret.push(new TerminalGroupTreeItem(terminalGroup.name, terminals));
            });
            return Promise.resolve(ret);
        } else {
            if (element.contextValue === "TerminalGroup") {
                return Promise.resolve(element.terminals);
            } else if (element.contextValue === "Terminal") {
                return Promise.resolve(element.cmds);
            }
        }
    }
}

export class TerminalGroupTreeItem extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly terminals: TerminalTreeItem[]
    ) {
        super(label, vscode.TreeItemCollapsibleState.Expanded);
    }

    contextValue = 'TerminalGroup';
}

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