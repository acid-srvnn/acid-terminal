import * as vscode from 'vscode';

/**
 * https://github.com/mhutchie/vscode-git-graph/blob/master/src/logger.ts  
 * https://github.com/huizhougit/githd/blob/master/src/tracer.ts
 */
export class Logger implements vscode.Disposable {
    private readonly channel: vscode.OutputChannel;

	/**
	 * Creates the Logger.
	 */
    constructor() {
        this.channel = vscode.window.createOutputChannel('acid-terminal');
    }

    /**
	 * Checks if extn is in dev mode.
	 */
    isDebugging(): boolean {
        const args = process.execArgv;
        return args && args.some(arg => arg.startsWith('--inspect'));
    }

	/**
	 * Disposes the resources used by the Logger.
	 */
    public dispose() {
        this.channel.dispose();
    }

	/**
	 * Log a message to the Output Channel.
	 * @param message The string to be logged.
	 */
    public log(message: string) {
        const date = new Date();
        const timestamp = date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate()) + ' ' + pad2(date.getHours()) + ':' + pad2(date.getMinutes()) + ':' + pad2(date.getSeconds()) + '.' + pad3(date.getMilliseconds());
        let msg = '[' + timestamp + '] ' + message;
        if (this.isDebugging()) {
            console.log('[acid-terminal] ' + msg);
        } else {
            this.channel.appendLine(msg);
        }
    }
}

/** 
 * Pad a number with a leading zero if it is less than two digits long.
 * @param n The number to be padded.
 * @returns The padded number.
 */
function pad2(n: number) {
    return (n > 9 ? '' : '0') + n;
}

/** 
 * Pad a number with leading zeros if it is less than three digits long.
 * @param n The number to be padded.
 * @returns The padded number.
 */
function pad3(n: number) {
    return (n > 99 ? '' : n > 9 ? '0' : '00') + n;
}