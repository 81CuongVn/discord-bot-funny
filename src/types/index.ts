import { Player } from "discord-player";
import { Client, Collection , User} from "discord.js";
import { IMessageCommandHandlers } from './MessageCommand';
import { ISlashCommandHandlers } from './slashCommand';
import { IButtonCommandHandlers } from './buttonCommands';

export interface IClient extends Client<boolean> {
  UserCreatBotId?: string;
  slashCommand?: Collection<string, ISlashCommandHandlers>;
  slashCommandObject?: any;
  player?: Player;
  buttonCommand?: Collection<string, IButtonCommandHandlers>;
  commands?: Collection<string, IMessageCommandHandlers>;
  aliases?: Collection<string, string>;
  categories?: string[];
  prefix?: string;
  menuCommand ?: Collection<string, IMessageCommandHandlers>;
}
    