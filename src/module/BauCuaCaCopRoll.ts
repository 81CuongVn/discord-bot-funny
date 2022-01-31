import { IClient } from "./../types/index";
import { Collection, Message, MessageEmbed } from "discord.js";
import { IPlayer } from "../commands/user/baucuacacop";
import { IGame } from "../commands/user/baucuacacop";
import { BauCuaCaCopGamePlayModel } from "../model/BauCuaCaCopGamePlay";
import { BauCuaCaCopPlayerModel } from "../model/BauCuCaCopPlayer";
const emojiList = [
  "0️⃣",
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "9️⃣",
  "🔟",
];

const bets = ["cộp", "bầu", "gà", "tôm", "cá", "cua"];
export default async (
  client: IClient,
  message: Message,
  args: string[],
  Player: Collection<string, IPlayer>,
  GamePlay: Collection<string, IGame>
) => {
  if (!message.guild) {
    message.reply("Không tìm thấy server");
    return;
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
  const ChoseBet = GameData.bit;
  const ChoseBetKey = Object.keys(ChoseBet);
  const EmbedAlertUserJoinToPlay = new MessageEmbed().setTitle(
    "các người đã đặt"
  );

  for (let key of ChoseBetKey) {
    const bet = ChoseBet[key];
    let description = "";
    for (let user of bet.userChose) {
      const UserPlayerInDatabase = await BauCuaCaCopPlayerModel.findOne({
        userId: user,
      });
      description =
        description +
        `<@${user}> đang chọn ${
          UserPlayerInDatabase
            ? UserPlayerInDatabase?.betChose?.numberAnimal
            : ""
        } ${key}`;
    }
    EmbedAlertUserJoinToPlay.addField(key, description);
  }
  EmbedAlertUserJoinToPlay.setColor("RANDOM");
  EmbedAlertUserJoinToPlay.setFooter("chơi trong vui vẻ không tiền");
  EmbedAlertUserJoinToPlay.setTimestamp();
  message.channel.send({
    embeds: [EmbedAlertUserJoinToPlay],
  });
  const messageData = await message.channel.send("bot đang lắc bầu cua cá cộp");
  const result: number[] = [];
  for (let i = 0; i < 3; i++) {
    const number = Math.floor(Math.random() * 6);
    result.push(number);
  }
  const resultString = result.map((number) => bets[number]);
  const resultEmoji = resultString.map((bet) => emojiList[bets.indexOf(bet)]);
  setTimeout(async () => {
    if (!message.guild) {
      message.reply("Không tìm thấy server");
      return;
    }
    const EmbedResult = new MessageEmbed().setTitle("kết quả");
    EmbedResult.addField("kết quả của bot random", resultEmoji.join(" "));
    EmbedResult.addField(
      "kết quả của sau khi con bot là dịch ra",
      resultString.join(" , ")
    );
    EmbedResult.setColor("RANDOM");
    EmbedResult.setFooter("chơi trong vui vẻ không tiền");
    EmbedResult.setTimestamp();
    if (messageData.deletable) messageData.delete();
    message.channel.send({
      embeds: [EmbedResult],
    });
    const winUser: {
      userId: string;
      bet: string;
      money: number;
    }[] = [];
    const loseUser: {
      userId: string;
      bet: string;
      money: number;
    }[] = [];

    for (let key of ChoseBetKey) {
      for (let BetName of resultString) {
        const ThisBet = ChoseBet[key];
        if (BetName === key) {
          for (let user of ThisBet.userChose) {
            // check if userId in Win User
            const UserInDatabase = await BauCuaCaCopPlayerModel.findOne({
              userId: user,
            });
            if (UserInDatabase) {
              let UserAfterUpdate =
                await BauCuaCaCopPlayerModel.findOneAndUpdate(
                  {
                    userId: user,
                  },
                  {
                    money: winUser.filter((userWin) => userWin.userId === user)
                      ? UserInDatabase.money +
                        (UserInDatabase?.betChose?.numberAnimal || 0)
                      : UserInDatabase.money +
                        (UserInDatabase.betChose?.numberAnimal || 0) * 2,
                  },
                  {
                    new: true,
                  }
                );
              if (!winUser.find((userWin) => userWin.userId === user)) {
                winUser.push({
                  userId: user,
                  bet: key,
                  money: UserAfterUpdate?.money || 0,
                });
              }
            }
          }
        }
      }
    }
    for (let key of ChoseBetKey) {
      for (let BetName of resultString) {
        if (BetName !== key) {
          const ThisBet = ChoseBet[key];
          for (let user of ThisBet.userChose) {
            if (!loseUser.find((userLose) => userLose.userId === user)) {
              if (!winUser.find((userWin) => userWin.userId === user)) {
                const UserInDatabase = await BauCuaCaCopPlayerModel.findOne({
                  userId: user,
                });
                loseUser.push({
                  userId: user,
                  bet: key,
                  money: UserInDatabase?.money || 0,
                });
              }
            }
          }
        }
      }
    }

    const EmbedWinLose = new MessageEmbed().setTitle("kết quả");
    EmbedWinLose.addField(
      "các bạn thắng",
      winUser.length
        ? winUser
            .map(
              (user) =>
                `<@${user.userId}> với con đặt là ${user.bet} với số tiền còn lại là ${user.money}`
            )
            .join(" , ")
        : "không ai thắng"
    );
    EmbedWinLose.addField(
      "các bạn thua",
      loseUser.length
        ? loseUser
            .map(
              (user) =>
                `<@${user.userId}> với con đặt là ${user.bet} với số tiền còn lại là ${user.money}`
            )
            .join(" , ")
        : "không ai thua"
    );
    EmbedWinLose.setColor("RANDOM");
    EmbedWinLose.setFooter("chơi trong vui vẻ không tiền");
    EmbedWinLose.setTimestamp();
    message.channel.send({
      embeds: [EmbedWinLose],
    });
    await BauCuaCaCopGamePlayModel.findOneAndDelete({
      serverId: message.guild.id,
    });
    message.channel.send("game đã kết thúc và bot đã xoá thông tin ván chơi");
  }, 10000);
};
