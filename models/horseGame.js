import mongoose, {Schema, models} from "mongoose";
const horseGameSchema = new Schema(
    {
        winner: {
            type: [String],            
        },
        surplus: {
            type: mongoose.Decimal128,
        },
        agreedprice: {
            type: [mongoose.Decimal128],
        },

        max: {
            type: mongoose.Decimal128,
            required: true, 
        },
        min: {
            type: mongoose.Decimal128,
            required: true,            
        },
        multiplier: {
            type: mongoose.Decimal128,
            required: true,            
        }, 
        isactive: {
            type: String,
            required: true,
            default: "active",
        },      
        updated: { type: Date, default: Date.now },
    },
    
);

const HorseGame = models.HorseGame || mongoose.model("HorseGame", horseGameSchema);
export default HorseGame;