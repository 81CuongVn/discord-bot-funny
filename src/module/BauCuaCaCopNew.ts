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
  const serverId = message.guild?.id;
  if (!serverId) {
    message.reply("Không tìm thấy server");
    return;
  }
  const ServerData = GamePlay.get(serverId);
  if (ServerData) {
    message.channel.send(
      "một server chỉ có thể có một ván trong bất kì thời điểm"
    );
    return;
  }
  let player = Player.get(message.author.id);
  if (!player) {
    Player.set(message.author.id, {
      serverId,
      userId: message.author.id,
      money: 100,
    });
    player = Player.get(message.author.id);
  }
  const newGame: IGame = {
    player: [],
    CreateBy: player || message.author.id,
    status: "waiting",
    bet: [],
  };
  GamePlay.set(serverId, newGame);
  if (!Player.get(message.author.id)) {
    const NewPlayer: IPlayer = {
      userId: message.author.id,
      money: 100,
      serverId,
    };
    Player.set(message.author.id, NewPlayer);
  }
  const thisCommandName = `${client.prefix}baucuacacop`;
  const description = `
một chút về luật chơi \n
luật 1 : bạn không thể đặt nếu số tiền trong túi của bạn không đủ\n
luật 2 : nếu bạn đặt nhiều lần thì lần đặt cuối cùng sẽ là lần đặt bot ghi nhận\n
luật 3 : để trò chơi vui thì không nên chơi acc clone \n
luật 4 các bạn ( các anh , chị ) chỉ có thể đặt những con trong danh sách gồm cộp, bầu, gà, tôm, cá, cua\n
chỉ có người tạo dùng lệnh ${thisCommandName} new mới được dùng roll\n
dùng lệnh ${thisCommandName} profile để có thể xem thông tin của bạn trong trò chơi\n
dùng lệnh ${thisCommandName} đặt để đặt bầu cua\n
ban đâu người dùng được tặng 100 đồng khi mà cháy túi thì được tặng 4 đồng\n
`;
    const embed = new MessageEmbed().setTitle("luật chơi").setDescription(description);
    message.channel.send({
        embeds : [embed]
    });
  message.channel.send(
    `phòng chơi đã mở với chủ phòng là <@${message.author.id}>`
  );
};
