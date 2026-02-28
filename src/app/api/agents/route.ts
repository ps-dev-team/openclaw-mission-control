import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("session");
  if (!session?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const configPath = join(process.env.HOME || "/root", ".openclaw", "openclaw.json");
    const config = JSON.parse(readFileSync(configPath, "utf-8"));
    const agents = (config?.agents?.list || []).map((a: Record<string, string>) => ({
      id: a.id,
      name: a.name || a.id,
      emoji: a.emoji || (a.id === "main" ? "🧠" : a.id === "linus" ? "🐧" : a.id === "quentin" ? "🎬" : "🤖"),
    }));
    return NextResponse.json({ agents });
  } catch {
    return NextResponse.json({ error: "Failed to read config" }, { status: 500 });
  }
}
