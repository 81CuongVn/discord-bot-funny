import { Message, PermissionResolvable } from "discord.js";
import { IClient } from "./index";
export interface IMessageCommandHandlers {
  name: string;
  category: string;
  aliases: string[];
  run: (client: IClient, message: Message, args: string[]) => Promise<void>;
  permission: PermissionResolvable[];
  description?: string;
  usage?: string;
}
