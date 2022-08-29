import {CommandStructure} from "../types/commandStructure";

export interface Command {
    name: string;
    description?: string;
    usage?: string;

    run(command: CommandStructure): Promise<string>;
}
