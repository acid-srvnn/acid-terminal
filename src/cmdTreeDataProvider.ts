import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { DataProvider } from './dataProvider';

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
            var cmdGroups = this.dataProvider.getConfig().cmdGroups;
            let ret:CmdGroup[] = [];
            cmdGroups.forEach(function (cmdGroup) {
                let cmds: Cmd[] = [];
                cmdGroup.cmds.forEach(function (cmd) {
                    cmds.push(new Cmd(cmd.name, cmd.cmd));        
                })
                ret.push(new CmdGroup(cmdGroup.name,cmds));
            });
            return Promise.resolve(ret);
        } else {           
            return Promise.resolve(element.cmds);
        }
    }
}

export class CmdGroup extends vscode.TreeItem{

    constructor(
        public readonly label: string,
        public readonly cmds: Cmd[]
	) {
		super(label, vscode.TreeItemCollapsibleState.Collapsed);
    }

	contextValue = 'CmdGroup';
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