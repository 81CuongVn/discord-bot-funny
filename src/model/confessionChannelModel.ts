
import { getModelForClass, prop , modelOptions} from "@typegoose/typegoose";

@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class confessionChannel {
    @prop({
        required: true,
    })
    channelId: string;
    @prop({
        required: true,
    })
    serverId: string;
}
export const confessionChannelModel = getModelForClass(confessionChannel);