import * as vscode from 'vscode';
import { Conf } from './main/conf/conf';
import { ViewProviders } from './main/viewProviders';
import { Commands } from './main/commands';

export function activate(context: vscode.ExtensionContext) {

	Conf.logger.log("Starting...");

	Conf.startupConfig();
	ViewProviders.setViews();
	Commands.setCommands(context);

	Conf.logger.log("Started...");

}

export function deactivate() { }
