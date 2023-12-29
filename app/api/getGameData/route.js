import { connectMongoDB } from "@/lib/mongodb";
import GameData from "@/models/gameData";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectMongoDB();       
        const data = await GameData.find();
        return NextResponse.json(data);

    } catch (error) {
        console.log(error);
    }
}