import { connectMongoDB } from "@/lib/mongodb";
import Game from "@/models/game";
//import GameData from "@/models/gameData";
import { NextResponse } from "next/server";
import mongoose, {Schema, models} from "mongoose";
export async function POST(req) {
    try {
        const { userwinner, winningbid, averagebid, numberofgame } = await req.json();
        console.log("the winner", userwinner);
        await connectMongoDB();
        //const user = await User.findOne({email}).select("_id");
        await Game.updateMany({isactive: "active"}, {isactive: "ended", winner: userwinner, winningbids: winningbid, useraveragebid:averagebid});
        
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