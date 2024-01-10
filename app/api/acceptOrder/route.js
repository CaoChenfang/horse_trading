import { connectMongoDB } from "@/lib/mongodb";
import HorseGameData from "@/models/horseGameData";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectMongoDB();
        const { userEmail, partyEmail, agreedPrice } = await req.json();
        //const user = await User.findOne({email}).select("_id");
        if (!userEmail || !agreedPrice || !partyEmail) {
            return NextResponse.json(
                {message: "All data required."}, {status: 201}
            );
          }
        await HorseGameData.updateMany({email: userEmail}, {status: "contracted", agreedprice: agreedPrice, tradingparty: partyEmail});
        await HorseGameData.updateMany({email: partyEmail}, {status: "contracted", agreedprice: agreedPrice, tradingparty: userEmail});
        console.log("the email", partyEmail);              

        return NextResponse.json(
            {message: "Bid submitted."}, {status: 201}
        );

    } catch (error) {
        console.log(error);
    }
}