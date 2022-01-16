import { Message, ButtonInteraction, CacheType } from "discord.js";
import { IClient } from "./index";
export interface IButtonCommandHandlers {
  name: string;
  run: (
    client: IClient,
    message: ButtonInteraction<CacheType>,
    args: string[]
  ) => Promise<void>;
}
