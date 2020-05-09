import * as vscode from 'vscode';
import * as fs from 'fs';

export class DataProvider {

    private config: ConfTemplate;

    constructor() {
        this.config = new ConfTemplate(undefined);
        this.refreshConfig();
        if (this.config.setTerminalsAtStart) {
            vscode.commands.executeCommand("acid-terminal.list.setup");
        }
    }

    getConfig() {
        return this.config;
    }

    refreshConfig() {
        let conf = vscode.workspace.getConfiguration("acid-terminal");
        let tempjson: Object | undefined;
        let tempconfig: ConfTemplate;
        let confType = conf.conf.type;

        if (confType === 'file') {
            let setting_conf_file: string | undefined = conf.conf.file;

            if (setting_conf_file === undefined || setting_conf_file === "") {
                tempjson = this.getDefaultConfig();
            } else {
                if (!fs.existsSync(setting_conf_file)) {
                    tempjson = this.getDefaultConfig();
                    vscode.window.showInformationMessage('acid-terminal - acid-terminal.conf.file not exists. generating sample file.');
                    fs.writeFile(setting_conf_file, JSON.stringify(tempjson), () => {

                    });
                } else {
                    let cnf = fs.readFileSync(setting_conf_file, "utf8");
                    tempjson = JSON.parse(cnf);
                }
            }
        } else if (confType === 'json') {
            tempjson = conf.conf.json;
            if (conf.conf.json.setTerminalsAtStart === undefined) {
                tempjson = this.getDefaultConfig();
            }
        } else {
            tempjson = conf.conf.json;
            if (conf.conf.json.setTerminalsAtStart === undefined) {
                tempjson = this.getDefaultConfig();
            }
        }

        tempconfig = new ConfTemplate(this.handleMissingProperties(tempjson));
        this.config = new ConfTemplate(tempjson);
    }

    handleMissingProperties(json: any) {
        var terminalGroups = json.terminalGroups;
        terminalGroups.forEach(function (terminalGroup: { terminals: any[]; }) {
            terminalGroup.terminals.forEach(function (terminal: { cmds: any[]; path: any; cmd: any; }) {
                terminal.cmds.forEach(function (cmd: any) {

                });
                terminal.path = terminal.path ? terminal.path : ".";
                terminal.cmd = terminal.cmd ? terminal.cmd : "";
            });
        });
        return json;
    }

    getDefaultConfig() {
        vscode.window.showInformationMessage("acid-terminal - using default config");
        return {
            setTerminalsAtStart: false,
            terminalGroups: [
                {
                    name: "main",
                    terminals: [
                        {
                            name: "ant / git",
                            cmds: [
                                {
                                    name: "install",
                                    cmd: "ant -f .\\build\\build-local.xml install"
                                },
                                {
                                    name: "setup",
                                    cmd: "ant -f .\\build\\build-local.xml setup"
                                }
                            ],
                            path: ".",
                            cmd: "ipconfig"
                        },
                        {
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
                },
                {
                    name: "logs",
                    terminals: [
                        {
                            name: "serverout",
                            cmds: [
                                {
                                    name: "Get-Content",
                                    cmd: "Get-Content -tail 5 -wait serverout.log"
                                }
                            ]
                        },
                        {
                            name: "clientlog",
                            cmds: [
                                {
                                    name: "Get-Content",
                                    cmd: "Get-Content -tail 5 -wait clientlog.log"
                                }
                            ]
                        }
                    ]
                }
            ],
            cmdGroups: [
                {
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
                },
                {
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
                }
            ]
        };
    }
}

export class ConfTemplate {

    constructor(json: any | undefined) {
        this.setTerminalsAtStart = false;
        this.terminalGroups = [];
        this.cmdGroups = [];
        if (json) {
            this.setTerminalsAtStart = json.setTerminalsAtStart;
            this.terminalGroups = json.terminalGroups;
            this.cmdGroups = json.cmdGroups;
        }
    }

    setTerminalsAtStart: boolean;
    terminalGroups: {
        name: string;
        terminals: {
            name: string;
            cmds: {
                name: string;
                cmd: string;
            }[];
            path: string;
            cmd: string;
        }[];
    }[];
    cmdGroups: {
        name: string;
        cmds: {
            name: string;
            cmd: string;
        }[];
    }[];
}