import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/user";

export async function POST(req) {
    try {
        const {name, email, password, role} = await req.json();
        //console.log("The admin", role);
        //console.log("The email", email);
        const hashedPassword = await bcrypt.hash(password,10);
        await connectMongoDB();        
        await User.create({name, email, password: hashedPassword, role})
        return NextResponse.json(
            {message: "User registered."}, {status: 201}
        );
        
    } catch (error) {
        return NextResponse.json(
            {message: "An error occurred while registering the user."}, {status: 500}
        )
    }
}