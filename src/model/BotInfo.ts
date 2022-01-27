import { prop, modelOptions, getModelForClass } from "@typegoose/typegoose";

export class BotInfo {
  @prop({ required: true, default: "bot cute" })
  username: string;
  @prop({ required: true, default: "889140130105929769" })
  owner: string;
  @prop()
  historyBotUpAndDown: {
    up: boolean;
    down: boolean;
    date: Date;
    reason: string;
  }[];
}
export const BotInfoModel = getModelForClass(BotInfo);