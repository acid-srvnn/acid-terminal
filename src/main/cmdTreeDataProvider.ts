import * as vscode from 'vscode';
import { Conf } from './conf/conf';
import { CmdGroupTreeItem } from './models/treeitem/cmdgroup/cmdGroupTreeItem';
import { CmdTreeItem } from './models/treeitem/cmdgroup/cmdTreeItem';

export class CmdTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    public _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;

    getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: any): vscode.ProviderResult<any[]> {
        if (!element) {
            let cmdGroups = Conf.getConfig().cmdGroups;
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