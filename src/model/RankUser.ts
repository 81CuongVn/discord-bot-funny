import { getModelForClass, prop, modelOptions } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class RankUser {
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
  rankMessage: number;
  @prop({
    required: true,
    default: 0,
  })
  rankAnswer: number;
}

export const RankUserModel = getModelForClass(RankUser);
