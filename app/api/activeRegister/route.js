import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import HorseGameData from "@/models/horseGameData";

export async function POST(req) {
    try {
        const {userEmail, assignedValue, userType} = await req.json();
        //console.log("The admin", role);
        //console.log("The email", email);
        await connectMongoDB();        
        await HorseGameData.create({email: userEmail, type: userType ,valuation: assignedValue})
        return NextResponse.json(
            {message: "Active user registered."}, {status: 201}
        );
        
    } catch (error) {
        return NextResponse.json(
            {message: "An error occurred while registering the user."}, {status: 500}
        )
    }
}