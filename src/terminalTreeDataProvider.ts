import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { DataProvider } from './dataProvider';

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
            let ret: TerminalGroup[] = [];
            terminalGroups.forEach(function (terminalGroup) {
                let terminals: Terminal[] = [];
                terminalGroup.terminals.forEach(function (terminal) {
                    let cmds: Cmd[] = [];
                    terminal.cmds.forEach(function (cmd) {
                        cmds.push(new Cmd(cmd.name, cmd.cmd, terminal.name));
                    });
                    terminals.push(new Terminal(terminal.name, cmds, terminal.path ? terminal.path : ".", terminal.cmd ? terminal.cmd : ""));
                });
                ret.push(new TerminalGroup(terminalGroup.name, terminals));
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

export class TerminalGroup extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly terminals: Terminal[]
    ) {
        super(label, vscode.TreeItemCollapsibleState.Expanded);
    }

    contextValue = 'TerminalGroup';
}

export class Terminal extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly cmds: Cmd[],
        public readonly path: string,
        public readonly cmd: string
    ) {
        super(label, vscode.TreeItemCollapsibleState.Expanded);
    }

    contextValue = 'Terminal';
}

export class Cmd extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly cmd: string,
        public readonly terminalName: string
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);
    }

    contextValue = 'Cmd';
}