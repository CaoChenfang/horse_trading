import mongoose, {Schema, models} from "mongoose";
const horseGameDataSchema = new Schema(
    {       
        email: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        valuation: {
            type:mongoose.Decimal128,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: "available",
        },
        agreedprice: {
            type:mongoose.Decimal128,
        },
        tradingparty: {
            type: String,
        },

        updated: { type: Date, default: Date.now },
    }
);

const HorseGameData = models.HorseGameData || mongoose.model("HorseGameData", horseGameDataSchema);
export default HorseGameData;