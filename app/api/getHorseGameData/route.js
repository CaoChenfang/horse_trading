import { connectMongoDB } from "@/lib/mongodb";
import HorseGameData from "@/models/horseGameData";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectMongoDB();       
        const data = await HorseGameData.find();
        return NextResponse.json(data);

    } catch (error) {
        console.log(error);
    }
}