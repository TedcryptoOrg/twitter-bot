import {CommandStructure} from "../types/commandStructure";

export interface Command {
    name: string;
    description: string;
    usage?: string;
    options?: void|{name: string, description: string, required: boolean}[];

    run(command: CommandStructure): Promise<string>;
}
