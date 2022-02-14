import { getModelForClass, prop, modelOptions } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class ServerInfo {
  @prop({ required: true })
  ServerId: string;
  @prop()
  BotChatChannel: {
    ChannelId: string;
  } | null;
  @prop()
  SpamChannel: {
    ChannelId: string;
    turnOnBotSendMessageToSpamChannel?: boolean;
    LogChannelId?: string;
  } | null;
  @prop()
  confessionChannel: {
    ChannelId: string;
  } | null;
}
export const ServerInfoModel = getModelForClass(ServerInfo);
