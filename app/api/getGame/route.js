import { connectMongoDB } from "@/lib/mongodb";
import Game from "@/models/game";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        await connectMongoDB();       
        const data = await Game.find({});
        return NextResponse.json( data );

    } catch (error) {
        console.log(error);
    }
}