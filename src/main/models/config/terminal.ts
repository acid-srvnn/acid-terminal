import { Cmd } from "./cmd";

export interface Terminal {
    name: string;
    cmds: Array<Cmd>;
    path?: string;
    cmd?: string;
}