import { connectMongoDB } from "@/lib/mongodb";
import HorseGameData from "@/models/horseGameData";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectMongoDB();
        const { userEmail } = await req.json();
        const user = await HorseGameData.findOne({email: userEmail});
        return NextResponse.json( { user });

    } catch (error) {
        console.log(error);
    }
}
