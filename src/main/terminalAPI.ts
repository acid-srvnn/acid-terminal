import * as vscode from 'vscode';
import { CmdTreeDataProvider } from './cmdTreeDataProvider';
import { TerminalTreeDataProvider } from './terminalTreeDataProvider';

export class TerminalAPI {

    static async createTerminalSync(terminal: any, command: string) {
        return new Promise(async resolve => {
            vscode.commands.executeCommand(command);
            let listener = vscode.window.onDidOpenTerminal(async e => {
                listener.dispose();
                await vscode.commands.executeCommand('workbench.action.terminal.renameWithArg', { name: terminal.name });
                e.sendText(`cd ${terminal.path}`, true);
                e.sendText(terminal.cmd, true);
                resolve();
            });
        });
    }

}