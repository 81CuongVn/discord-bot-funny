import { modelOptions, prop, getModelForClass } from "@typegoose/typegoose";
import { BauCuaCaCopPlayer } from "./BauCuCaCopPlayer";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class BauCuaCaCopGamePlay {
  @prop()
  serverId: string;
  @prop()
  player: string[];
  @prop()
  CreateBy: string;
  @prop({})
  status: string;
  @prop({})
  bit: {
    [key: string]: {
      userChose: string[];
      numberChose: number;
    };
  };
}
export const BauCuaCaCopGamePlayModel = getModelForClass(BauCuaCaCopGamePlay);
