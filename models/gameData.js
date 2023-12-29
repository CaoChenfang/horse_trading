import mongoose, {Schema, models} from "mongoose";
const gameDataSchema = new Schema(
    {       
        email: {
            type: String,
            required: true,
        },
        bid: {
                type: [mongoose.Decimal128], 
                required: true,},       
        updated: { type: Date, default: Date.now },
    }
);

const GameData = models.GameData || mongoose.model("GameData", gameDataSchema);
export default GameData;