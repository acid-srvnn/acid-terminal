import * as vscode from 'vscode';
import { DataProvider } from './dataProvider';
import path = require('path');

export class CmdTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

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
            let cmdGroups = this.dataProvider.getConfig().cmdGroups;
            let ret: CmdGroupTreeItem[] = [];
            cmdGroups.forEach(function (cmdGroup) {
                let cmds: CmdTreeItem[] = [];
                cmdGroup.cmds.forEach(function (cmd) {
                    cmds.push(new CmdTreeItem(cmd.name, cmd.cmd, cmd.dontexecute!));
                });
                ret.push(new CmdGroupTreeItem(cmdGroup.name, cmds));
            });
            return Promise.resolve(ret);
        } else {
            return Promise.resolve(element.cmds);
        }
    }
}

export class CmdGroupTreeItem extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly cmds: CmdTreeItem[]
    ) {
        super(label, vscode.TreeItemCollapsibleState.Expanded);
    }

    contextValue = 'CmdGroup';
}

export class CmdTreeItem extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly cmd: string,
        public readonly dontexecute: boolean
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.tooltip = cmd;
        this.description = cmd;
    }

    contextValue = 'Cmd';
}