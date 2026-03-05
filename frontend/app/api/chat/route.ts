import { NextRequest, NextResponse } from "next/server";
import { getResponse } from "@/lib/chatLogic";

// FastAPI backend URL
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Try to call FastAPI backend first
    try {
      const backendResponse = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        return NextResponse.json({
          reply: data.reply,
          source: data.source
        });
      }
    } catch (backendError) {
      console.log("FastAPI backend not available, using local fallback");
    }

    // Fallback to local chat logic if backend is not available
    const reply = await getResponse(message);
    return NextResponse.json({ reply, source: "local-fallback" });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
