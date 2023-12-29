import { connectMongoDB } from "@/lib/mongodb";
import Game from "@/models/game";
//import GameData from "@/models/gameData";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { maxNumBid, gameLength, gameType } = await req.json();
        console.log("the maximu of bid", maxNumBid);
        await connectMongoDB();
        //const user = await User.findOne({email}).select("_id");
        //await GameData.remove();
        await Game.create({
            winner: [],
            maxnumbid: maxNumBid,
            gamelength: gameLength,
            gametype: gameType,           

        })
      
        return NextResponse.json(
            {message: "Game created."}, {status: 201}
        );

    } catch (error) {
        console.log(error);
    }
}