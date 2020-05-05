import * as vscode from 'vscode';
import { DataProvider } from './dataProvider';
import { CmdTreeDataProvider } from './cmdTreeDataProvider';
import { TerminalTreeDataProvider, Terminal } from './terminalTreeDataProvider';
import { resolve } from 'dns';

export function activate(context: vscode.ExtensionContext) {

	var dataProvider = new DataProvider();

	vscode.window.registerTreeDataProvider('acid-terminal-list-view', new TerminalTreeDataProvider(dataProvider));
	vscode.window.registerTreeDataProvider('acid-terminal-cmd-view', new CmdTreeDataProvider(dataProvider));

	let disposable = vscode.commands.registerCommand('acid-terminal.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from acid-terminal!');
	});
	context.subscriptions.push(disposable);

	let disposable2 = vscode.commands.registerCommand('acid-terminal.refreshConf', () => {
		dataProvider.refreshConfig();
	});
	context.subscriptions.push(disposable2);

	let disposable3 = vscode.commands.registerCommand('acid-terminal.cmd.run', (args) => {
		let activeTerminal = vscode.window.activeTerminal;
		if (!activeTerminal) {
			vscode.window.createTerminal();
			activeTerminal = vscode.window.activeTerminal;
		}
		activeTerminal?.show();
		activeTerminal?.sendText(args.cmd, true);
	});
	context.subscriptions.push(disposable3);

	let disposable4 = vscode.commands.registerCommand('acid-terminal.list.delete', (args) => {
		vscode.window.terminals.forEach(async (terminal) => {
			terminal.dispose();
		})
	});
	context.subscriptions.push(disposable4);

	let disposable5 = vscode.commands.registerCommand('acid-terminal.list.setup', async (args) => {
		for (var i = 0; i < dataProvider.getConfigJson().terminalGroups.length; i++){
			let terminalGroup = dataProvider.getConfigJson().terminalGroups[i];
			await createTerminalSync(terminalGroup.terminals[0],"workbench.action.terminal.newInActiveWorkspace");			
			for (var j = 1; j < terminalGroup.terminals.length; j++){				
				await createTerminalSync(terminalGroup.terminals[j],"workbench.action.terminal.split");
			}
		}
	});
	context.subscriptions.push(disposable5);

	let disposable6 = vscode.commands.registerCommand('acid-terminal.list.show', (args) => {
		vscode.window.terminals.forEach(async (terminal) => {
			if (terminal.name == args.label) {
				terminal.show();
			}
		})
	});
	context.subscriptions.push(disposable6);

	let disposable7 = vscode.commands.registerCommand('acid-terminal.list.run', (args) => {
		vscode.window.terminals.forEach(async (terminal) => {
			if (terminal.name == args.terminalName) {
				terminal.show();
				terminal.sendText(args.cmd, true);
			}
		})
	});
	context.subscriptions.push(disposable7);
}

async function createTerminalSync(terminal: any, command: string) {
	return new Promise(async resolve => {
		await vscode.commands.executeCommand(command);
		let listener = vscode.window.onDidOpenTerminal(async e => {
			listener.dispose();
			await vscode.commands.executeCommand('workbench.action.terminal.renameWithArg', { name: terminal.name })
			e.sendText(`cd ${terminal.path}`, true);
			e.sendText(terminal.cmd, true);
			resolve();
		});
	});
}

export function deactivate() { }
