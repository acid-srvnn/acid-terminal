export class DataProvider{
	refreshConfig() {
		
    }
    getConfigJson() {
        let json = this.getConfig();
        var terminalGroups = json.terminalGroups;
            terminalGroups.forEach(function (terminalGroup) {
                terminalGroup.terminals.forEach(function (terminal) {
                    terminal.cmds.forEach(function (cmd) {
                        
                    });
                    terminal.path = terminal.path ? terminal.path : ".";
                    terminal.cmd = terminal.cmd ? terminal.cmd : "";
                })
            });
        return json;
    }
    getConfig(){
        return {
            setTerminalsAtStart: true,
            terminalGroups: [
                {
                    name: "main",
                    terminals: [
                        {
                            name: "ant / git",
                            cmds: [
                                {
                                    name: "install",
                                    cmd : "ant -f .\\build\\build-local.xml install"
                                },
                                {
                                    name: "setup",
                                    cmd : "ant -f .\\build\\build-local.xml setup"
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
                                    cmd : "run.bat"
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
                                    cmd : "Get-Content"
                                }
                            ]
                        },
                        {
                            name: "clientlog",
                            cmds: [
                                {
                                    name: "Get-Content",
                                    cmd : "Get-Content"
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
                            cmd : "ant -f .\\build\\build-local.xml install"
                        },
                        {
                            name: "setup",
                            cmd : "ant -f .\\build\\build-local.xml setup"
                        }
                    ]
                },
                {
                    name: "git",
                    cmds: [
                        {
                            name: "fetch",
                            cmd : "git fetch"
                        }
                    ]
                }
            ]
        }
    }
}