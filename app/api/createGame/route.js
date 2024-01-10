import { connectMongoDB } from "@/lib/mongodb";
import HorseGame from "@/models/horseGame";
//import GameData from "@/models/gameData";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { maxVal, minVal, buyerMultiplier} = await req.json();        
        await connectMongoDB();
        //const user = await User.findOne({email}).select("_id");
        //await GameData.remove();
        await HorseGame.create({
            max: maxVal,
            min: minVal,
            multiplier: buyerMultiplier,
        })
      
        return NextResponse.json(
            {message: "Game created."}, {status: 201}
        );

    } catch (error) {
        console.log(error);
    }
}