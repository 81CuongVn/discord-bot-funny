import { Player } from "discord-player";
import { Client, Collection , User} from "discord.js";
import { IMessageCommandHandlers } from './MessageCommand';
import { ISlashCommandHandlers } from './slashCommand';
import { IButtonCommandHandlers } from './buttonCommands';
import DisTube from "distube";

export interface IClient extends Client<boolean> {
  UserCreatBotId?: string;
  slashCommand?: Collection<string, string>; // chút import vào rồi dùng
  slashCommandObject?: any;
  disTube?: DisTube;
  commands?: Collection<string, IMessageCommandHandlers>;
  aliases?: Collection<string, string>;
  categories?: string[];
  prefix?: string;
}
    