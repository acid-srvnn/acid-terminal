import * as vscode from 'vscode';
import { CmdTreeDataProvider } from './cmdTreeDataProvider';
import { TerminalTreeDataProvider } from './terminalTreeDataProvider';

export class ViewProviders {
    static cmdListProvider: CmdTreeDataProvider;
    static terminalListProvider: TerminalTreeDataProvider;

    static cmdListView: vscode.TreeView<any>;
    static terminalListView: vscode.TreeView<any>;

    static setViews(): void {

        ViewProviders.cmdListProvider = new CmdTreeDataProvider();
        ViewProviders.terminalListProvider = new TerminalTreeDataProvider();

        ViewProviders.cmdListView = vscode.window.createTreeView('acid-terminal-cmd-view', {
            treeDataProvider: ViewProviders.cmdListProvider
        });

        ViewProviders.terminalListView = vscode.window.createTreeView('acid-terminal-list-view', {
            treeDataProvider: ViewProviders.terminalListProvider
        });
    }
}