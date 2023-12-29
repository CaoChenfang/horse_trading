import { connectMongoDB } from "@/lib/mongodb";
import GameData from "@/models/gameData";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectMongoDB();
        const { useremail, userbid } = await req.json();
        //const user = await User.findOne({email}).select("_id");
        if (!useremail || !userbid) {
            return NextResponse.json(
                {message: "All data required."}, {status: 201}
            );
          }
        const id = await GameData.findOne({email: useremail}).select("_id");
        console.log(id);
        if (!id) {
            await GameData.create({
                email: useremail,
                bid: [userbid],
            })
        }
        await GameData.updateMany({_id: id}, {
            $push:{bid: userbid}, updated: new Date(),
        }
            );
        console.log("the email", useremail);
        console.log("user's bid", userbid);
        

        return NextResponse.json(
            {message: "Bid submitted."}, {status: 201}
        );

    } catch (error) {
        console.log(error);
    }
}