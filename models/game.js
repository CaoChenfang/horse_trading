import mongoose, {Schema, models} from "mongoose";
const gameSchema = new Schema(
    {
        winner: {
            type: [String],            
        },
        winningbids: {
            type: [mongoose.Decimal128],
        },
        useraveragebid: {
            type: mongoose.Decimal128,
        },
        maxnumbid: {
            type: Number,
            required: true,
            default: 1,
        },
        gamelength: {
            type: Number,
            required: true,
            default: 10,
        },
        gametype: {
            type: String,
            required: true,
            default: "private",
        },
        isactive: {
            type: String,
            required: true,
            default: "active",
        },
        updated: { type: Date, default: Date.now },
    },
    
);

const Game = models.Game || mongoose.model("Game", gameSchema);
export default Game;