import { Cmd } from "./cmd";

export interface CmdGroup {
    name: string;
    cmds: Array<Cmd>;
}