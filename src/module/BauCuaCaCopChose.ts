import { IClient } from "./../types/index";
import { Collection, Message, MessageEmbed } from "discord.js";
import { IPlayer } from "../commands/user/baucuacacop";
import { IGame } from "../commands/user/baucuacacop";
import { BauCuaCaCopPlayerModel } from "../model/BauCuCaCopPlayer";
import { BauCuaCaCopGamePlayModel } from "../model/BauCuaCaCopGamePlay";
export default async (
  client: IClient,
  message: Message,
  args: string[],
  Player: Collection<string, IPlayer>,
  GamePlay: Collection<string, IGame>
) => {
  let player = await BauCuaCaCopPlayerModel.findOne({
    userId: message.author.id,
  });
  if (!message.guild) {
    message.reply("Không tìm thấy server");
    return;
  }
  if (!player) {
    player = await new BauCuaCaCopPlayerModel({
      serverId: message.guild.id,
      userId: message.author.id,
      money: 100,
    }).save();
  }
  const GameData = await BauCuaCaCopGamePlayModel.findOne({
    serverId: message.guild.id,
  });
  if (!GameData) {
    message.reply(
      "Không tìm thấy ván chơi hãy dùng lệnh " +
        client.prefix +
        "baucuacacop new"
    );
    return;
  }
  if (GameData.status === "playing") {
    message.reply("Đang chơi ván chơi không thể đặt");
    return;
  }
  if (GameData.status === "end") {
    message.reply("Ván chơi đã kết thúc không thể đặt");
    return;
  }

  // if player money is 0 set money to the 4
  if (player.money === 0) {
    await BauCuaCaCopPlayerModel.findOneAndUpdate(
      {
        userId: message.author.id,
      },
      {
        money: 4,
      }
    );
  }
  const regex = /(\d+)( |-)?(cộp|bầu|gà|tôm|cá|cua)/g;
  const match = regex.exec(args.join(" "));
  if (!match) {
    message.reply(
      `Bạn chưa nhập đủ thông tin đặt theo cấu trúc ${client.prefix}baucuacacop đặt <số lượng> <cộp|bầu|gà|tôm|cá|cua> ví dụ 5 cua`
    );
    return;
  }
  const money = parseInt(match[1]);
  // if player money < bet  return

  if (player.money < money) {
    message.reply("Bạn không đủ tiền để đặt cược");
    return;
  }

  const betChose = match[4];
  const bets = ["cộp", "bầu", "gà", "tôm", "cá", "cua"];
  // check bet chose in bets
  if (bets.includes(betChose)) {
    message.reply("Bạn chưa chọn đúng loại cược");
    return;
  }
  // check bet chose is not in betChose
  for (let bet of bets) {
    for (let betChoses of match) {
      if (bet === betChoses) {
        const PlayerAfterUpdate = await BauCuaCaCopPlayerModel.findOneAndUpdate(
          {
            userId: message.author.id,
          },
          {
            betChose: {
              animal: bet,
              numberAnimal: money,
            },
            money: player.money - money,
          }
        );
        await BauCuaCaCopGamePlayModel.findOneAndUpdate(
          {
            serverId: message.guild.id,
          },
          {
            player: [...GameData.player, message.author.id],
          }
        );

        if (GameData.bit && GameData?.bit[bet]) {
          if (GameData?.bit[bet].userChose.filter(userId => userId === message.author.id).length >= 1) {
            message.reply("Bạn đã đặt cược rồi con này rồi");
            return;
          }
          // for (let key of Object.keys(GameData.bit)) {
          //   const ThisBet = GameData.bit[key];
          //   if (ThisBet.userChose.indexOf(message.author.id)) {
          //     message.reply("Bạn đã đặt cược rồi nên bot sẽ bỏ cược trước và lấy cược hiện tại");

          //   }
          // }
          await BauCuaCaCopGamePlayModel.findOneAndUpdate(
            {
              serverId: message.guild.id,
            },
            {
              bit: {
                ...GameData.bit,
                [bet]: {
                  userChose: [
                    ...GameData.bit[bet].userChose,
                    message.author.id,
                  ],
                  numberChose: GameData.bit[bet].numberChose + money,
                },
              },
            }
          );
        } else {
          await BauCuaCaCopGamePlayModel.findOneAndUpdate(
            {
              serverId: message.guild.id,
            },
            {
              bit: {
                ...GameData.bit,
                [bet]: {
                  userChose: [message.author.id],
                  numberChose: money,
                },
              },
            }
          );
        }

        message.reply("Bạn đã đặt cược thành công : " + money + " " + bet);
        return;
      }
    }
  }
};
