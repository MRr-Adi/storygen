import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Generate the Story with Google Gemini (This part IS 100% free!)
    const fullPrompt = `Write a short, engaging kids story about: ${body.prompt}. 
    Make it fun, imaginative, and around 3 paragraphs long. 
    At the very end, include a clear "Moral of the Story:" to make it educational.`;

    const textResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });
    const story = textResponse.text;

    // 2. The Pro Developer Pivot for Images!
    // Google set our image quota to 0, so we use a 100% free open-source image API instead.
    const safePrompt = encodeURIComponent(`A beautiful, colorful, 3d cartoon style kids book illustration of: ${body.prompt}`);
    const imageUrl = `https://image.pollinations.ai/prompt/${safePrompt}?width=800&height=400&nologo=true`;

    // 3. Send BOTH the story and the picture URL back to the frontend
    return NextResponse.json({ story: story, image: imageUrl });
    
  } catch (error) {
    console.error("THE REAL ERROR IS:", error);
    return NextResponse.json({ error: "Uh oh! The magic wand fizzled. Try again!" }, { status: 500 });
  }
}