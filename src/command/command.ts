import {Client, Tweet} from "twitter.js";

export interface Command {
    name: string;
    description?: string;
    usage?: string;

    run(client: Client, tweet: Tweet, command: string[]): Promise<void>;
}
