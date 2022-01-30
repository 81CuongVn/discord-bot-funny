import { IMessageCommandHandlers } from "./../../types/MessageCommand";
import { Collection, MessageEmbed } from "discord.js";
import BauCuaCaCopRoll from "../../module/BauCuaCaCopRoll";
import BauCuaCaCopChose from "../../module/BauCuaCaCopChose";
import BauCuaCaCopNew from "../../module/BauCuaCaCopNew";
import { BauCuaCaCopPlayerModel } from "../../model/BauCuCaCopPlayer";

export interface IPlayer {
  serverId: string;
  userId: string;
  money: number;
  betChose?: {
    animal: string;
    numberAnimal: number;
  };
}
export type StatusGame = "waiting" | "playing" | "end";
export interface IGame {
  player: IPlayer[];
  CreateBy: string | IPlayer;
  status: string;
  bet: {
    animal: string;
    UserChose: IPlayer[];
    numberAnimal: number;
  }[];
}
const GamePlay = new Collection<string, IGame>();
const Player = new Collection<string, IPlayer>();
export default {
  name: "baucuacacop",
  category: "user",
  aliases: ["bau"],
  usage: "baucuacacop <command> ",
  run: async (client, message, args) => {
    if (args[0] === "new") {
      BauCuaCaCopNew(client, message, args, Player, GamePlay);
    }
    if (args[0] === "đặt") {
      BauCuaCaCopChose(client, message, args, Player, GamePlay);
    }
    if (args[0] === "roll") {
      BauCuaCaCopRoll(client, message, args, Player, GamePlay);
    }
    if (args[0] === "profile") {
      let userData = await BauCuaCaCopPlayerModel.findOne({
        userId: message.author.id,
      });
      if (!userData) {
        message.reply(
          "bạn chưa có profile dùng lệnh " +
            client.prefix +
            "baucuacacop registration"
        );
        return;
      }
      const embed = new MessageEmbed()
        .setTitle("profile")
        .setDescription(`<@${userData.userId}> có ${userData.money} đồng`);
      message.channel.send({
        embeds: [embed],
      });
    }
    if (args[0] === "registration") {
      const userData = await BauCuaCaCopPlayerModel.findOne({
        userId: message.author.id,
      });
      if (userData) {
        message.reply("bạn đã có profile rồi");
        return;
      }
      if (!message.guild) {
        message.reply("Không tìm thấy server");
        return;
      }
      await new BauCuaCaCopPlayerModel({
        serverId: message.guild?.id,
        userId: message.author.id,
        money: 100,
      }).save();
    }
  },
} as IMessageCommandHandlers;
