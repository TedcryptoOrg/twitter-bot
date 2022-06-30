import {Client, Tweet} from "twitter.js";
import {CommandStructure} from "../main";

export interface Command {
    name: string;
    description?: string;
    usage?: string;

    run(client: Client, tweet: Tweet, command: CommandStructure): Promise<void>;
}
