import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    const configPath = join(process.env.HOME || "/root", ".openclaw", "openclaw.json");
    const config = JSON.parse(readFileSync(configPath, "utf-8"));
    const gatewayToken = config?.gateway?.auth?.token;

    if (!gatewayToken || token !== gatewayToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const sessionToken = createHash("sha256")
      .update(token + Date.now().toString())
      .digest("hex");

    const response = NextResponse.json({ ok: true });
    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24h
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
