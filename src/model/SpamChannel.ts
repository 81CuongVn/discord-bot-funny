import { getModelForClass, prop , modelOptions} from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class SpamChannel {
    @prop({
        required: true,
    })
    channelId: string;
    @prop({
        required: true,
    })
    serverId: string;
    @prop({default: false})
    turnOnBotSendMessageToSpamChannel: boolean;
}
export const SpamChannelModel = getModelForClass(SpamChannel);