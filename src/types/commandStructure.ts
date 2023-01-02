import {Context} from "telegraf";
import {Platforms} from "../enums/platforms";

export type CommandStructure = {
    command: string,
    arguments: string[],
    platform: Platforms,
    ctx?: Context|null
}