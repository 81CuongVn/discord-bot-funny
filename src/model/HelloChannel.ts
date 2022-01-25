import { getModelForClass, prop, modelOptions } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class HelloChannel {
  @prop({
    required: true,
  })
  channelId: string;
  @prop({
    required: true,
  })
  serverId: string;
  @prop({
    required: true,
    default: false,
  })
  isDeleted: boolean;
  @prop({
    required: false,
  })
  roleId: string | undefined | null;
}
export const HelloChannelModel = getModelForClass(HelloChannel);
