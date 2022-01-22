import {
  Client,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  User,
} from "discord.js";
import wiki from "wikijs";
import { IMessageCommandHandlers } from "./../../types/MessageCommand";
const dataExportSearchGoogle: IMessageCommandHandlers = {
  name: "search",
  category: "fun",
  aliases: ["find", "search"],
  description: "Tìm kiếm trên wiki",
  usage: "searchWiki <từ khóa>",
  run: async (client: Client<boolean>, message: Message, args: string[]) => {
    try {
      let searchKey = args.join(" ");
      if (!searchKey) {
        message.channel.send("you need to input the key to search");
      }
      const mainWikiUrl = `https://${process.env.botlanguage}.wikipedia.org`;
      const wikiFun = wiki({
        apiUrl: `${mainWikiUrl}/w/api.php`,
        origin: undefined,
      }); // or 'https://en.wikipedia.org/w/api.php'
      const embed = new MessageEmbed();
      const search = await (await wikiFun.search(searchKey)).results;
      if (search.length === 0) {
        embed.setTitle("Không tìm thấy kết quả nào");
        embed.setColor("#ff0000");
        embed.setDescription(
          "Xin lỗi, tôi không tìm thấy kết quả nào cho từ khóa của bạn"
        );
        embed.setTimestamp();
        embed.setFooter("Bot by: @thằng điên nào đó trên mạng");
        message.channel.send({ embeds: [embed] });
        return;
      }
      const page = await wikiFun.page(search[0]);
      const pageContent = await page.summary();
      const pageUrl = await page.url();
      embed.setTitle(`${page.raw.title} (bấm để xem thêm)`);
      embed.setURL(pageUrl);
      embed.setDescription(pageContent);
      embed.setColor("#0099ff");
      embed.setFooter("Bot by @thằng điên nào đó , nguồn : " + mainWikiUrl);
      embed.setThumbnail(await page.mainImage());
      embed.setTimestamp();
      embed.setImage(await page.mainImage());

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      message.channel.send("server have some error try again later");
    }
  },
};
export default dataExportSearchGoogle;
