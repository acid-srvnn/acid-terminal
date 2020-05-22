import * as vscode from 'vscode';
import * as fs from 'fs';
import { Config } from '../models/config/config';
import { DefaultConf } from './defaultconf';
import { Logger } from '../logger';

export class Conf {

    //Global Logger
    static logger = new Logger();

    private static _conf: Config = DefaultConf.getEmptyConfig();

    static startupConfig() {
        this.refreshConfig();
        if (this._conf.setTerminalsAtStart) {
            vscode.commands.executeCommand("acid-terminal.list.setup");
        }
    }

    static getConfig() {
        return this._conf;
    }

    static refreshConfig() {
        this.logger.log("RefreshConfig Start");
        this.logger.log(JSON.stringify(this.getConfig()));
        let vsconf = vscode.workspace.getConfiguration("acid-terminal");
        let tempConfig: Config;
        let confType = vsconf.conf.type;

        if (confType === 'file') {
            let setting_conf_file: string | undefined = vsconf.conf.file;

            if (setting_conf_file === undefined || setting_conf_file === "") {
                tempConfig = DefaultConf.getDefaultConfig();
            } else {
                if (!fs.existsSync(setting_conf_file)) {
                    tempConfig = DefaultConf.getDefaultConfig();
                    vscode.window.showInformationMessage('acid-terminal - acid-terminal.conf.file not exists. generating sample file.');
                    fs.writeFile(setting_conf_file, JSON.stringify(tempConfig), () => {

                    });
                } else {
                    let cnf = fs.readFileSync(setting_conf_file, "utf8");
                    tempConfig = JSON.parse(cnf);
                }
            }
        } else {
            tempConfig = vsconf.conf.json;
        }

        tempConfig = this.handleMissingProperties(tempConfig);
        this._conf = tempConfig;
        this.logger.log(JSON.stringify(this.getConfig()));
        this.logger.log("RefreshConfig End");
    }

    static handleMissingProperties(json: Config): Config {
        this.logger.log("handleMissingProperties");
        this.logger.log(JSON.stringify(json));
        let ret: Config = DefaultConf.getEmptyConfig();

        if (json.setTerminalsAtStart === undefined) {
            ret = DefaultConf.getDefaultConfig();
        } else {
            ret.setTerminalsAtStart = json.setTerminalsAtStart;

            if (json.terminalGroups) {
                ret.terminalGroups = json.terminalGroups;
            }
            if (json.cmdGroups) {
                ret.cmdGroups = json.cmdGroups;
            }
        }

        ret.terminalGroups.forEach(function (terminalGroup) {
            terminalGroup.terminals.forEach(function (terminal) {
                terminal.cmds.forEach(function (cmd) {
                    cmd.dontexecute = cmd.dontexecute ? cmd.dontexecute : false;
                });
                terminal.path = terminal.path ? terminal.path : '.';
                terminal.cmd = terminal.cmd ? terminal.cmd : '';
            });
        });
        ret.cmdGroups.forEach(function (cmdGroup) {
            cmdGroup.cmds.forEach(function (cmd) {
                cmd.dontexecute = cmd.dontexecute ? cmd.dontexecute : false;
            });
        });
        return ret;
    }

}