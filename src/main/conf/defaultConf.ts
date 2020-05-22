import * as vscode from 'vscode';
import { Config } from '../models/config/config';
import { TerminalGroup } from '../models/config/terminalGroup';
import { CmdGroup } from '../models/config/cmdGroup';
import { Conf } from './conf';

export class DefaultConf {

    static getEmptyConfig(): Config {
        return {
            setTerminalsAtStart: false,
            terminalGroups: [],
            cmdGroups: []
        };
    }

    static getDefaultConfig(): Config {

        Conf.logger.log("Getting default config");

        vscode.window.showInformationMessage("acid-terminal - using default config", ...['Open Settings'])
            .then(selection => {
                if (selection === 'Open Settings') {
                    vscode.commands.executeCommand('acid-terminal.openmysettings');
                }
            });

        let tg1: TerminalGroup = {
            name: "main",
            terminals: [
                {
                    name: "ant / git",
                    path: ".",
                    cmd: "ipconfig",
                    cmds: [
                        {
                            name: "install",
                            cmd: "ant -f .\\build\\build-local.xml install"
                        },
                        {
                            name: "setup",
                            cmd: "ant -f .\\build\\build-local.xml setup"
                        }
                    ]
                }, {
                    name: "product",
                    cmds: [
                        {
                            name: "run",
                            cmd: "run.bat"
                        },
                        {
                            name: "debug",
                            cmd: "debug.bat"
                        }
                    ]
                }
            ]
        };

        let tg2: TerminalGroup = {
            name: "logs",
            terminals: [
                {
                    name: "logview1",
                    cmds: [
                        {
                            name: "serverout",
                            cmd: "Get-ChildItem \".\\logs\\serverout*\" | Sort desc | Get-Content -tail 100 -wait"
                        }
                    ]
                },
                {
                    name: "logview2",
                    cmds: [
                        {
                            name: "clientlog",
                            cmd: "Get-ChildItem \".\\logs\\clientlog*\" | Sort desc | Get-Content -tail 100 -wait"
                        },
                        {
                            name: "agentlog",
                            cmd: "Get-ChildItem \".\\logs\\agentlog*\" | Sort desc | Get-Content -tail 100 -wait"
                        }
                    ]
                }
            ]
        };

        let cg1: CmdGroup = {
            name: "ant",
            cmds: [
                {
                    name: "install",
                    cmd: "ant -f .\\build\\build-local.xml install"
                },
                {
                    name: "setup",
                    cmd: "ant -f .\\build\\build-local.xml setup"
                },
                {
                    name: "jar",
                    cmd: "ant -f .\\build\\build-local.xml jar"
                }
            ]
        };

        let cg2: CmdGroup = {
            name: "git",
            cmds: [
                {
                    name: "fetch",
                    cmd: "git fetch"
                },
                {
                    name: "pull",
                    cmd: "git pull"
                }
            ]
        };

        let cg3: CmdGroup = {
            name: "vsce",
            cmds: [
                {
                    name: "package",
                    cmd: "vsce package"
                },
                {
                    name: "publish",
                    cmd: "vsce publish",
                    dontexecute: true
                },
                {
                    name: "install",
                    cmd: "code --install-extension",
                    dontexecute: true
                }
            ]
        };

        return {
            setTerminalsAtStart: false,
            terminalGroups: [tg1, tg2],
            cmdGroups: [cg1, cg2, cg3]
        };
    }
}