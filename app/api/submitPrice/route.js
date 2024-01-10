import { connectMongoDB } from "@/lib/mongodb";
import HorseGameData from "@/models/horseGameData";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectMongoDB();
        const { userEmail, price } = await req.json();
        //const user = await User.findOne({email}).select("_id");
        if (!userEmail || !price) {
            return NextResponse.json(
                {message: "All data required."}, {status: 201}
            );
          }
        await HorseGameData.updateMany({email: userEmail}, {status: "offered", agreedprice: price});

        console.log("the email", userEmail);
        console.log("user's bid", price);
        

        return NextResponse.json(
            {message: "Bid submitted."}, {status: 201}
        );

    } catch (error) {
        console.log(error);
    }
}