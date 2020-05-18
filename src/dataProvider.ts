import * as vscode from 'vscode';
import * as fs from 'fs';

export class DataProvider {

    private _config: Config = {
        setTerminalsAtStart: false,
        terminalGroups: [],
        cmdGroups: []
    };

    constructor() {
        this.refreshConfig();
        if (this._config.setTerminalsAtStart) {
            vscode.commands.executeCommand("acid-terminal.list.setup");
        }
    }

    getConfig() {
        return this._config;
    }

    refreshConfig() {
        let conf = vscode.workspace.getConfiguration("acid-terminal");
        let tempConfig: Config;
        let confType = conf.conf.type;

        if (confType === 'file') {
            let setting_conf_file: string | undefined = conf.conf.file;

            if (setting_conf_file === undefined || setting_conf_file === "") {
                tempConfig = this.getDefaultConfig();
            } else {
                if (!fs.existsSync(setting_conf_file)) {
                    tempConfig = this.getDefaultConfig();
                    vscode.window.showInformationMessage('acid-terminal - acid-terminal.conf.file not exists. generating sample file.');
                    fs.writeFile(setting_conf_file, JSON.stringify(tempConfig), () => {

                    });
                } else {
                    let cnf = fs.readFileSync(setting_conf_file, "utf8");
                    tempConfig = JSON.parse(cnf);
                }
            }
        } else {
            tempConfig = conf.conf.json;
            if (conf.conf.json.setTerminalsAtStart === undefined) {
                tempConfig = this.getDefaultConfig();
            }
        }

        tempConfig = this.handleMissingProperties(tempConfig);
        this._config = tempConfig;
    }

    handleMissingProperties(json: Config): Config {
        json.terminalGroups.forEach(function (terminalGroup) {
            terminalGroup.terminals.forEach(function (terminal) {
                terminal.cmds.forEach(function (cmd) {
                    cmd.dontexecute = cmd.dontexecute ? cmd.dontexecute : false;
                });
                terminal.path = terminal.path ? terminal.path : '.';
                terminal.cmd = terminal.cmd ? terminal.cmd : '';
            });
        });
        json.cmdGroups.forEach(function (cmdGroup) {
            cmdGroup.cmds.forEach(function (cmd) {
                cmd.dontexecute = cmd.dontexecute ? cmd.dontexecute : false;
            });
        });
        return json;
    }

    getDefaultConfig(): Config {
        vscode.window.showInformationMessage("acid-terminal - using default config", ...['Setup Now'])
            .then(selection => {
                if (selection === 'Setup Now') {
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

export interface Config {
    setTerminalsAtStart: boolean;
    terminalGroups: Array<TerminalGroup>;
    cmdGroups: Array<CmdGroup>
}

export interface TerminalGroup {
    name: string;
    terminals: Array<Terminal>;
}

export interface Terminal {
    name: string;
    cmds: Array<Cmd>;
    path?: string;
    cmd?: string;
}

export interface CmdGroup {
    name: string;
    cmds: Array<Cmd>;
}

export interface Cmd {
    name: string;
    cmd: string;
    dontexecute?: boolean;
}