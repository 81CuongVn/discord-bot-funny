import { getModelForClass, prop , modelOptions} from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class BotChatChannel {
    @prop({
        required: true,
    })
    channelId: string;
    @prop({
        required: true,
    })
    serverId: string;
    @prop({default: false})
    turnOnBotChatChannel: boolean;
}
export const BotChatChannelModel = getModelForClass(BotChatChannel);