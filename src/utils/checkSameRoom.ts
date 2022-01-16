import {
  CacheType,
  CommandInteraction,
  Message,
  MessageEmbed,
  VoiceBasedChannel,
  ButtonInteraction,
  SelectMenuInteraction,
} from "discord.js";
import { IClient } from "../types";

export const checkSameRoom = async (
  interaction: CommandInteraction<CacheType>|ButtonInteraction<CacheType>|SelectMenuInteraction<CacheType>,
  voiceChannel: VoiceBasedChannel | null
) => {
  if (!voiceChannel) {
    await interaction.editReply({
      content: "You are not in a voice channel!",
    });
    return false;
  }
  if (
    interaction.guild?.me?.voice.channelId &&
    voiceChannel.id !== interaction.guild?.me.voice.channelId
  ) {
    await interaction.editReply({
      content: "You are not in my voice channel!",
    });
    return false;
  }
  return true;
};

export const checkSameRoomForButtonCommand = async (
  interaction: ButtonInteraction<CacheType>,
  voiceChannel: VoiceBasedChannel | null
) => {
  if (!voiceChannel) {
    await interaction.reply({
      content: "You are not in a voice channel!",
      ephemeral: true,
    });
    return false;
  }
  if (
    interaction.guild?.me?.voice.channelId &&
    voiceChannel.id !== interaction.guild?.me.voice.channelId
  ) {
    await interaction.reply({
      content: "You are not in my voice channel!",
      ephemeral: true,
    });
    return false;
  }
  return true;
};

export const NoMusicToPlayEmbed = () => {
  return new MessageEmbed()
    .setTitle("No music to play!")
    .setColor("#ff0000")
    .setDescription("Please add some music to the queue first!")
    .setTimestamp()
    .setFooter("Bot by: @thằng điên nào đó trên mạng");
};

export const getVoiceChannel = (
  interaction: CommandInteraction<CacheType>|ButtonInteraction<CacheType>|SelectMenuInteraction<CacheType>,
  client: IClient
) => {
  if (!interaction.guildId) {
    interaction.reply("bot chỉ dùng trong server");
    return false;
  }
  if (!interaction.member?.user.id) {
    interaction.reply("bot chỉ dùng trong server");
    return false;
  }
  const guild = client.guilds.cache.get(interaction.guildId);
  if (!guild) {
    interaction.reply("server không tồn tại");
    return false;
  }
  const member = guild.members.cache.get(interaction.member?.user.id);
  if (!member) {
    interaction.reply("bạn không thể dùng lệnh này");
    return false;
  }
  const voiceChannel = member.voice.channel;
  if (!voiceChannel) {
    interaction.reply("bạn phải ở trong voice channel");
    return false;
  }
  return voiceChannel;
};

export const getVoiceChannelForButtonCommand = (
  interaction: ButtonInteraction<CacheType>,
  client: IClient
) => {
  if (!interaction.guildId) {
    interaction.reply("bot chỉ dùng trong server");
    return false;
  }
  if (!interaction.member?.user.id) {
    interaction.reply("bot chỉ dùng trong server");
    return false;
  }
  const guild = client.guilds.cache.get(interaction.guildId);
  if (!guild) {
    interaction.reply("server không tồn tại");
    return false;
  }
  const member = guild.members.cache.get(interaction.member?.user.id);
  if (!member) {
    interaction.reply("bạn không thể dùng lệnh này");
    return false;
  }
  const voiceChannel = member.voice.channel;
  return voiceChannel;
};

export const checkSameRoomForMessage = async (
    message: Message,
    client: IClient
) => {
    if (!message.member?.voice.channel) {
        await message.reply({
            content: "You are not in a voice channel!",
        });
        return false;
    }
    if (message.guild?.me?.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId) {
        await message.reply({
            content: "You are not in bot voice channel!",
        });
        return false;
    }
    // return voice channel
    return message.member?.voice.channel;
}
