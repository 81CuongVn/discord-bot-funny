import { prop, modelOptions, getModelForClass } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Vote {
  @prop({ required: true })
  ServerId: string;
  @prop({ required: true })
  UserId: string;
  @prop({ required: true })
  VoteNumber: number;
    @prop()
    VoteData: {
      VoteValue: number;
      UserVote: string;
    };
}
export const VoteModel = getModelForClass(Vote);
