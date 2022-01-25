import { IMessageCommandHandlers } from "../../types/MessageCommand";
import { Client, Message } from "discord.js";
function msToHMS(ms: number) {
  // 1- Convert to seconds:
  let seconds = ms / 1000;
  // 2- Extract hours:
  const hours = parseInt(String(seconds / 3600)); // 3,600 seconds in 1 hour
  seconds = seconds % 3600; // seconds remaining after extracting hours
  // 3- Extract minutes:
  const minutes = parseInt(String(seconds / 60)); // 60 seconds in 1 minute
  // 4- Keep only seconds not extracted to minutes:
  seconds = parseInt(String(seconds % 60));
  return hours + "h:" + minutes + "m:" + seconds + "s";
}
const dataExportPing: IMessageCommandHandlers = {
  name: "ping",
  category: "user",
  aliases: ["p"],
  description: "ping bot",
  usage: "ping",
  permission: [],
  run: async (client: Client<boolean>, message: Message, args: string[]) => {
    try {
      message.channel.send(
        `Pong! ${client.ws.ping} ms và bot đã up được ${
          client.uptime && msToHMS(client.uptime)
        }`
      );
    } catch (error) {
      console.log(error);
      message.channel.send("server have some error try again later");
    }
  },
};
export default dataExportPing;
