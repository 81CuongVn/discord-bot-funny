import { IClient } from "./../types/index";
import { Collection, Message, MessageEmbed } from "discord.js";
import { IPlayer } from "../commands/user/baucuacacop";
import { IGame } from "src/commands/user/baucuacacop";
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
  const GameData = GamePlay.get(message.guild?.id);
  if (!GameData) {
    message.reply(
      "Không tìm thấy ván chơi hãy dùng lệnh " +
        client.prefix +
        "baucuacacop new"
    );
    return;
  }
  if (GameData.bet.length <= 0) {
    message.reply("Không có ai đặt cược");
    return;
  }
  if (GameData.status === "playing") {
    message.reply("ván đang roll rồi nhé");
    return;
  }
  GameData.status = "playing";
  console.log(GameData);
  const bet = GameData.bet;
  const player = GameData.player;
  const result: number[] = [];
    for (let i = 0; i < 3; i++) {
    const number = Math.floor(Math.random() * 6)
    result.push(number);
  }
  const embed = new MessageEmbed().setTitle("các bạn đã đặt cược");
  bet.forEach((bet) => {
    const userChose = bet.UserChose;
    const animal = bet.animal;
    let description = "";
    for (let userData of userChose) {
      description +=
        "<@" +
        userData.userId +
        "> đã đặt cược " +
        animal +
        "(" +
        bet.numberAnimal +
        ")\n";
    }
    console.log(animal);
    embed.addField(animal, description);
  });
  message.channel.send({ embeds: [embed] });
  setTimeout(() => {
    if (!message.guild) {
      message.reply("Không tìm thấy server");
      return;
    }
    const embed = new MessageEmbed().setTitle("Kết quả roll");
    // emoji list from 0 to 10
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
    embed.addField(
      "Các số đã roll ra được",
      `${emojiList[result[0]]} ${emojiList[result[1]]} ${emojiList[result[2]]}`
    );
    embed.addField(
      "sau khi con bot nó dịch ra",
      `${bets[result[0]]} ${bets[result[1]]} ${bets[result[2]]}`
    );
    message.channel.send({ embeds: [embed] });
    // check result
    let win: IPlayer[] = [];
    let lose: IPlayer[] = [];
    const draw = [];
    const allBetRollName = [bets[result[0]], bets[result[1]], bets[result[2]]];
    GameData.bet.forEach((bet) => {
        allBetRollName.forEach((betRollName) => {
        if (bet.animal === betRollName) {
          bet.UserChose.forEach((userChose) => {
            win.push(userChose);
          });
        } else {
          bet.UserChose.forEach((userChose) => {
            lose.push(userChose);
          });
        }
      });
    });
    // if user in win list and that user in lose list => delete user in lose list
      console.log(win,lose);
    win.forEach((winUser) => {
      lose.forEach((loseUser) => {
        if (winUser.userId === loseUser.userId) {
          lose = lose.filter((user) => user.userId !== loseUser.userId);
        }
      });
    });
    embed.addField(
      "Các người thắng",
      win.length ? win.map((user) => `<@${user.userId}>`).join(", ") : "không có ai thắng"
    );
    embed.addField(
      "Các người thua",
      lose.length ? lose.map((user) => `<@${user.userId}>`).join(", ") : "không có ai thua"
    );
    // if user win => add money to user
    win.forEach((winUser) => {
      const user = Player.get(winUser.userId);
      if (user) {
        GameData.bet.forEach((bet) => {
          if (
            bet.UserChose.find(
              (userChose) => userChose.userId === winUser.userId
            )
          ) {
            user.money += bet.numberAnimal;
          }
        });
      }
    });
    message.channel.send({ embeds: [embed] });
    GamePlay.delete(message.guild?.id);
  }, 1000);
};
