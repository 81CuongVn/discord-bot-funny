import { IMessageCommandHandlers } from './../../types/MessageCommand';

export default {
    name: "giveRole".toLocaleLowerCase(),
    description: "give Role for user",
    category: "admin",
    aliases: ["giveRole"],
    usage: "giveRole <role channel> <title> <description> <color> <roleName> <emoji>",
    run: async (client, message, args) => {
        const channelId = args[0];
        const title = args[1];
        const description = args[2];
        const color = args[3];
        const channel = client.channels.cache.get(channelId);
        if (!channel) {
            message.channel.send("channel not found");
            return;
        }
        if (!message.member?.permissions.has("MANAGE_ROLES")) {
            message.channel.send("you don't have permission to manage roles");
            return;
        }
    }
} as IMessageCommandHandlers