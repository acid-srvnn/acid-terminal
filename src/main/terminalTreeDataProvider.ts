import * as vscode from 'vscode';
import { Conf } from './conf/conf';
import { TerminalGroupTreeItem } from './models/treeitem/terminalgroup/terminalGroupTreeItem';
import { TerminalTreeItem } from './models/treeitem/terminalgroup/terminalTreeItem';
import { CmdTreeItem } from './models/treeitem/terminalgroup/cmdTreeItem';

export class TerminalTreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    public _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;

    getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: any): vscode.ProviderResult<any[]> {
        if (!element) {
            let terminalGroups = Conf.getConfig().terminalGroups;
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