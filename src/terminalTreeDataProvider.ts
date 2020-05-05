import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { DataProvider } from './dataProvider';

export class TerminalTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    dataProvider: DataProvider;

    constructor(param: DataProvider) {
        this.dataProvider = param;
    }

    onDidChangeTreeData?: vscode.Event<any> | undefined;
    getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: any): vscode.ProviderResult<any[]> {
        if (!element) {
            var terminalGroups = this.dataProvider.getConfigJson().terminalGroups;
            let ret:TerminalGroup[] = [];
            terminalGroups.forEach(function (terminalGroup) {
                let terminals: Terminal[] = [];
                terminalGroup.terminals.forEach(function (terminal) {
                    let cmds: Cmd[] = [];
                    terminal.cmds.forEach(function (cmd) {
                        cmds.push(new Cmd(cmd.name, cmd.cmd));
                    })
                    terminals.push(new Terminal(terminal.name, cmds));        
                })
                ret.push(new TerminalGroup(terminalGroup.name,terminals));
            });
            return Promise.resolve(ret);
        } else {
            if (element.contextValue == "TerminalGroup") {
                return Promise.resolve(element.terminals);
            } else if (element.contextValue == "Terminal") {
                return Promise.resolve(element.cmds);
            }
        }
    }
}

export class TerminalGroup extends vscode.TreeItem{

    constructor(
        public readonly label: string,
        public readonly terminals: Terminal[]
	) {
		super(label, vscode.TreeItemCollapsibleState.Expanded);
    }

	contextValue = 'TerminalGroup';
}

export class Terminal extends vscode.TreeItem{

    constructor(
        public readonly label: string,
        public readonly cmds: Cmd[]
	) {
		super(label, vscode.TreeItemCollapsibleState.Collapsed);
    }

	contextValue = 'Terminal';
}

export class Cmd extends vscode.TreeItem{

    constructor(
        public readonly label: string,
        public readonly cmd: string
	) {
		super(label, vscode.TreeItemCollapsibleState.None);
    }  

	contextValue = 'Cmd';
}