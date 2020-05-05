import * as vscode from 'vscode';
import { DataProvider } from './dataProvider';
import { CmdTreeDataProvider } from './cmdTreeDataProvider';
import { TerminalTreeDataProvider } from './terminalTreeDataProvider';

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
		console.log(args);
		let activeTerminal = vscode.window.activeTerminal;
		if (!activeTerminal) {
			vscode.window.createTerminal();
			activeTerminal = vscode.window.activeTerminal;
		}
		activeTerminal?.show();
		activeTerminal?.sendText(args.cmd, true);
	});	
	context.subscriptions.push(disposable3);
}

export function deactivate() {}
