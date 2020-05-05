export class DataProvider{
	refreshConfig() {
		
	}
    getConfigJson() {
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
                            ]
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