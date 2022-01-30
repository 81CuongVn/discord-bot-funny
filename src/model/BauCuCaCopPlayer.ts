import { modelOptions, prop, getModelForClass } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class BauCuaCaCopPlayer {
  @prop({required: true})
  serverId: string;
  @prop({required: true})
  userId: string;
  @prop({required: true})
  money: number;
  @prop()
  betChose?: {
    animal: string;
    numberAnimal: number;
  };
}
export const BauCuaCaCopPlayerModel = getModelForClass(BauCuaCaCopPlayer);
