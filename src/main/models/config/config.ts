import { TerminalGroup } from "./terminalGroup";
import { CmdGroup } from "./cmdGroup";

export interface Config {
    setTerminalsAtStart: boolean;
    terminalGroups: Array<TerminalGroup>;
    cmdGroups: Array<CmdGroup>
    terminalRenameDelay?: number;
}