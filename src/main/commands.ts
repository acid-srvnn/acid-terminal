import * as vscode from 'vscode';
import { Conf } from './conf/conf';
import { ViewProviders } from './viewProviders';
import { TerminalAPI } from './terminalAPI';

export class Commands {

    static setCommands(context: vscode.ExtensionContext) {
        let disposable2 = vscode.commands.registerCommand('acid-terminal.refreshConf', () => {
            Conf.refreshConfig();
            ViewProviders.terminalListProvider._onDidChangeTreeData.fire();
            ViewProviders.cmdListProvider._onDidChangeTreeData.fire();
        });
        context.subscriptions.push(disposable2);

        let disposable3 = vscode.commands.registerCommand('acid-terminal.cmd.run', (args) => {
            let activeTerminal = vscode.window.activeTerminal;
            if (!activeTerminal) {
                vscode.window.createTerminal();
                activeTerminal = vscode.window.activeTerminal;
            }
            activeTerminal!.show();
            activeTerminal!.sendText(args.cmd, !args.dontexecute);
        });
        context.subscriptions.push(disposable3);

        let disposable4 = vscode.commands.registerCommand('acid-terminal.list.delete', (args) => {
            vscode.window.terminals.forEach(async (terminal) => {
                terminal.dispose();
            });
        });
        context.subscriptions.push(disposable4);

        let disposable5 = vscode.commands.registerCommand('acid-terminal.list.setup', async (args) => {
            for (var i = 0; i < Conf.getConfig().terminalGroups.length; i++) {
                let terminalGroup = Conf.getConfig().terminalGroups[i];
                await TerminalAPI.createTerminalSync(terminalGroup.terminals[0], "workbench.action.terminal.newInActiveWorkspace");
                for (var j = 1; j < terminalGroup.terminals.length; j++) {
                    await TerminalAPI.createTerminalSync(terminalGroup.terminals[j], "workbench.action.terminal.split");
                }
            }
        });
        context.subscriptions.push(disposable5);

        let disposable6 = vscode.commands.registerCommand('acid-terminal.list.show', (args) => {
            let status: boolean = false;
            vscode.window.terminals.forEach(async (terminal) => {
                if (terminal.name === args.label) {
                    terminal.show();
                    status = true;
                }
            });
            if (!status) {
                vscode.window.showInformationMessage('acid-terminal - setup first');
            }
        });
        context.subscriptions.push(disposable6);

        let disposable7 = vscode.commands.registerCommand('acid-terminal.list.run', (args) => {
            let status: boolean = false;
            vscode.window.terminals.forEach(async (terminal) => {
                if (terminal.name === args.terminalName) {
                    terminal.show();
                    terminal.sendText(args.cmd, !args.dontexecute);
                    status = true;
                }
            });
            if (!status) {
                vscode.window.showInformationMessage('acid-terminal - setup first');
            }
        });
        context.subscriptions.push(disposable7);

        let disposable12 = vscode.commands.registerCommand('acid-terminal.openmysettings', async (args) => {
            vscode.commands.executeCommand('workbench.action.openSettings', 'acid-terminal');
        });
        context.subscriptions.push(disposable12);
    }
}