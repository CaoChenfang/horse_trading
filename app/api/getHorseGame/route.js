import { connectMongoDB } from "@/lib/mongodb";
import HorseGame from "@/models/horseGame";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectMongoDB();       
        const data = await HorseGame.find({});
        return NextResponse.json( data );

    } catch (error) {
        console.log(error);
    }
}