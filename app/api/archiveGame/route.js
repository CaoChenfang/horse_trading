import { connectMongoDB } from "@/lib/mongodb";
import Game from "@/models/game";
//import GameData from "@/models/gameData";
import { NextResponse } from "next/server";
import mongoose, {Schema, models} from "mongoose";
export async function POST(req) {
    try {
        const {  numberofgame } = await req.json();
        await connectMongoDB();
        //const user = await User.findOne({email}).select("_id");
        
        //Archive Gamedata
        var db = mongoose.connection.db;
        await db.collection('gamedatas').rename(`archivedgamedatas${numberofgame}`)
        return NextResponse.json(
            {message: "Game ended."}, {status: 201}
        );

    } catch (error) {
        console.log(error);
    }
}