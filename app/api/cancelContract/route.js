import { connectMongoDB } from "@/lib/mongodb";
import HorseGameData from "@/models/horseGameData";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectMongoDB();
        const { userEmail, partyEmail } = await req.json();
        //const user = await User.findOne({email}).select("_id");
        console.log("The party", partyEmail)
        if (!userEmail || !partyEmail) {
            return NextResponse.json(
                {message: "All data required."}, {status: 201}
            );
          }
        await HorseGameData.updateMany({email: userEmail}, {$unset:{agreedprice: 1, tradingparty: 1},status: "available"});        
        await HorseGameData.updateMany({email: partyEmail}, {$unset:{agreedprice: 1, tradingparty: 1},status: "available"}); 
           
        return NextResponse.json(
            {message: "Bid submitted."}, {status: 201}
        );

    } catch (error) {
        console.log(error);
    }
}