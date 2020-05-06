# acid-terminal

Terminal Helper Extension for VS Code


## Features

* Store frequently used, lengthy terminal commands and run them with ease
* Store frequently used terminals / terminal groups and have them at ready always
* Optionally open your stored terminal list at VS Code startup

## Extension Settings

* `acid-terminal.conf.json`:
```json
{
    "setTerminalsAtStart": true,
    "terminalGroups": [
        {
            "name": "logs",
            "terminals": [
                {
                    "name": "serverout",
                    "cmds": [
                        {
                            "name": "serverout",
                            "cmd": "Get-Content -tail 5 -wait serverout.log"
                        }
                    ],
                    "path": ".\\product\\logs\\",
                    "cmd": "ipconfig"
                }
            ]
        }
    ],
    "cmdGroups": [
        {
            "name": "ant",
            "cmds": [
                {
                    "name": "install",
                    "cmd": "ant -f .\\build\\build-local.xml install"
                },
                {
                    "name": "jar",
                    "cmd": "ant -f .\\build\\build-local.xml jar"
                }
            ]
        }
    ]
}
```
-----------------------------------------------------------------------------------------------------------
