import * as vscode from 'vscode';
import { DataProvider } from './dataProvider';
import { CmdTreeDataProvider } from './cmdTreeDataProvider';
import { TerminalTreeDataProvider, Terminal } from './terminalTreeDataProvider';
import { resolve } from 'dns';

export function activate(context: vscode.ExtensionContext) {

	var dataProvider = new DataProvider();
	var terminalDataProvider = new TerminalTreeDataProvider(dataProvider);
	var cmdTreeDataProvider = new CmdTreeDataProvider(dataProvider);

	vscode.window.registerTreeDataProvider('acid-terminal-list-view', terminalDataProvider);
	vscode.window.registerTreeDataProvider('acid-terminal-cmd-view', cmdTreeDataProvider);

	let disposable = vscode.commands.registerCommand('acid-terminal.helloWorld', () => {
		vscode.window.showInformationMessage('acid-terminal - hello');
	});
	context.subscriptions.push(disposable);

	let disposable2 = vscode.commands.registerCommand('acid-terminal.refreshConf', () => {
		dataProvider.refreshConfig();
		terminalDataProvider._onDidChangeTreeData.fire();
		cmdTreeDataProvider._onDidChangeTreeData.fire();
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
		});
	});
	context.subscriptions.push(disposable4);

	let disposable5 = vscode.commands.registerCommand('acid-terminal.list.setup', async (args) => {
		for (var i = 0; i < dataProvider.getConfig().terminalGroups.length; i++){
			let terminalGroup = dataProvider.getConfig().terminalGroups[i];
			await createTerminalSync(terminalGroup.terminals[0],"workbench.action.terminal.newInActiveWorkspace");			
			for (var j = 1; j < terminalGroup.terminals.length; j++){				
				await createTerminalSync(terminalGroup.terminals[j],"workbench.action.terminal.split");
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
				terminal.sendText(args.cmd, true);
				status = true;
			}
		});
		if (!status) {
			vscode.window.showInformationMessage('acid-terminal - setup first');
		}
	});
	context.subscriptions.push(disposable7);
}

async function createTerminalSync(terminal: any, command: string) {
	return new Promise(async resolve => {
		await vscode.commands.executeCommand(command);
		let listener = vscode.window.onDidOpenTerminal(async e => {
			listener.dispose();
			await vscode.commands.executeCommand('workbench.action.terminal.renameWithArg', { name: terminal.name });
			e.sendText(`cd ${terminal.path}`, true);
			e.sendText(terminal.cmd, true);
			resolve();
		});
	});
}

export function deactivate() { }
