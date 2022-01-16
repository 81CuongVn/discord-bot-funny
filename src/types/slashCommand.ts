import {  ApplicationCommandOptionData, ApplicationCommandType, CacheType, CommandInteraction, CommandInteractionOptionResolver } from 'discord.js';
import { IClient } from './index';

export interface ISlashCommandHandlers {
  usage?: string;
  name: string;
  description?: string;
  aliases?: string[];
  type?: ApplicationCommandType;
  run: (
    client: IClient,
    interaction: CommandInteraction<CacheType>,
    options: Omit<
      CommandInteractionOptionResolver<CacheType>,
      "getMessage" | "getFocused"
    >
  ) => any
  defaultPermission?: boolean;
  options?: Array<ApplicationCommandOptionData>;
}