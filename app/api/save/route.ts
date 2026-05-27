import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { connectToDatabase } from "@/lib/mongodb";

import Story from "@/models/Story";



export async function POST(request: Request) {

  try {

    // 1. Check the Bouncer: Who is asking to save this?

    const { userId } = await auth();

    

    if (!userId) {

      return NextResponse.json({ error: "You must be logged in to save!" }, { status: 401 });

    }



    // 2. Open the Vault

    await connectToDatabase();



    // 3. Read the package sent from the web browser

    const body = await request.json();



    // 4. Use our Blueprint to create a permanent record in MongoDB

    const newStory = await Story.create({

      userId: userId,

      prompt: body.prompt,

      storyText: body.story,

      imageUrl: body.image,

    });



    // 5. Tell the frontend it was a success!

    return NextResponse.json({ success: true, story: newStory });

    

  } catch (error) {

    console.error("Vault Error:", error);

    return NextResponse.json({ error: "Failed to lock the story in the vault." }, { status: 500 });

  }

}