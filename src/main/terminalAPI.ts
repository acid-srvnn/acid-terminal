import * as vscode from 'vscode';
import { CmdTreeDataProvider } from './cmdTreeDataProvider';
import { Conf } from './conf/conf';
import { TerminalTreeDataProvider } from './terminalTreeDataProvider';

export class TerminalAPI {

    static async createTerminalSync(terminal: any, command: string) {
        return new Promise(async resolve => {
            vscode.commands.executeCommand(command);
            let listener = vscode.window.onDidOpenTerminal(async e => {
                listener.dispose();                
                e.sendText(`cd ${terminal.path}`, true);
                e.sendText(terminal.cmd, true);
                setTimeout(() => 
                {
                    e.show();
                    vscode.commands.executeCommand('workbench.action.terminal.renameWithArg', { name: terminal.name });                    
                },
                Conf.getConfig().terminalRenameDelay!);
                resolve(1);
            });
        });
    }

    static showMessageToSetup() {
        vscode.window.showInformationMessage('acid-terminal - setup terminals first', ...['Setup Now'])
            .then(selection => {
                if (selection === 'Setup Now') {
                    vscode.commands.executeCommand('acid-terminal.list.setup');
                }
            });
    }

}