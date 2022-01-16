import { ISlashCommandHandlers } from "src/types/slashCommand";
import { Constants, MessageEmbed } from "discord.js";
import wiki from "wikijs";
export default {
  name: "findInWiki".toLocaleLowerCase(),
  description: "tìm kiếm trong wiki",
  aliases: ["finddoc", "finddocuments"],
  usage: "<tên tài liệu>",
  options: [
    {
      name: "searchKey".toLocaleLowerCase(),
      description: "nhập từ khoá",
      type: Constants.ApplicationCommandOptionTypes.STRING,
      required: true,
    },
  ],
  run: async (client, interaction, args) => {
    try {
        await interaction.deferReply()
      const searchKey = interaction.options.getString("searchKey".toLocaleLowerCase());
      if (!searchKey) {
        interaction.editReply("Vui lòng nhập tên tài liệu");
        return;
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
        interaction.editReply({ embeds: [embed] });
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

      interaction.editReply({ embeds: [embed] });
    } catch (e) {
      console.log(e);
      interaction.editReply("Có lỗi xảy ra");
      return;
    }
  },
} as ISlashCommandHandlers;
