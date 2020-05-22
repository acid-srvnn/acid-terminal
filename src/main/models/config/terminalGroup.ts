import { Terminal } from "./terminal";

export interface TerminalGroup {
    name: string;
    terminals: Array<Terminal>;
}