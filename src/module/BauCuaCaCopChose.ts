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
  let player = Player.get(message.author.id);
  if (!message.guild) {
    message.reply("Không tìm thấy server");
    return;
  }
  if (!player) {
    const newPlayer: IPlayer = {
      userId: message.author.id,
      money: 100,
      serverId: message.guild?.id,
    };

    Player.set(message.author.id, newPlayer);
    player = newPlayer;
  }
  const GameData = GamePlay.get(player.serverId);
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
    player.money = 4;
  }
  const regex = /(\d+)( |-)?(cộp|bầu|gà|tôm|cá|cua)/g;
  const match = regex.exec(args.join(" "));
  if (!match) {
    message.reply(`Bạn chưa nhập đủ thông tin đặt theo cấu trúc ${client.prefix}baucuacacop đặt <số lượng> <cộp|bầu|gà|tôm|cá|cua> ví dụ 5 cua`);
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
        player.betChose = {
          animal: bet,
          numberAnimal: money,
        };
        player.money -= money;
        GameData.player.push(player);
        // find animal in GameData.bet with filed animal
        const findAnimal = GameData.bet.find(
          (bet) => bet.animal === player?.betChose?.animal
        );
        if (findAnimal) {
          findAnimal.UserChose.push(player);
        } else {
          GameData.bet.push({
            animal: player.betChose.animal,
            UserChose: [player],
            numberAnimal: player.betChose.numberAnimal,
          });
        }

        message.reply(
          "Bạn đã đặt cược thành công : " +
            player.betChose?.numberAnimal +
            " " +
            player.betChose?.animal
        );
        return;
      }
    }
  }
};
