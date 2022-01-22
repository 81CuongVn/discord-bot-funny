import { getModelForClass, prop, modelOptions } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class xpUser {
  @prop({
    required: true,
  })
  userId: string;
  @prop({
    required: true,
  })
  serverId: string;
  @prop({
    required: true,
    default: 0,
  })
  xpMessage: number;
  @prop({
    required: true,
    default: 0,
  })
  xpAnswer: number;
}

export const xpUserModel = getModelForClass(xpUser);
