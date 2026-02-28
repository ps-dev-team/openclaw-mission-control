import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const WORKSPACE_MAP: Record<string, string> = {
  main: "/home/ubuntu/berto",
};

function readFileSafe(path: string): string | null {
  try {
    if (!existsSync(path)) return null;
    return readFileSync(path, "utf-8");
  } catch {
    return null;
  }
}

function parseIdentity(content: string) {
  const name = content.match(/\*\*Name:\*\*\s*(.+)/)?.[1]?.trim();
  const emoji = content.match(/\*\*Emoji:\*\*\s*(.+)/)?.[1]?.trim();
  const role = content.match(/\*\*Role:\*\*\s*(.+)/)?.[1]?.trim();
  return { name, emoji, role };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = request.cookies.get("session");
  if (!session?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const configPath = join(process.env.HOME || "/root", ".openclaw", "openclaw.json");
    const config = JSON.parse(readFileSync(configPath, "utf-8"));
    const agentList = config?.agents?.list || [];
    const defaultWorkspace = config?.agents?.defaults?.workspace;

    const agentConfig = agentList.find((a: Record<string, string>) => a.id === id);
    if (!agentConfig) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const workspace = agentConfig.workspace || WORKSPACE_MAP[id] || defaultWorkspace;
    if (!workspace) {
      return NextResponse.json({ error: "No workspace configured" }, { status: 404 });
    }

    const identityContent = readFileSafe(join(workspace, "IDENTITY.md"));
    const parsed: { name?: string; emoji?: string; role?: string } = identityContent ? parseIdentity(identityContent) : {};

    const FALLBACKS: Record<string, { name: string; emoji: string; role: string }> = {
      main: { name: "Berto", emoji: "🦞", role: "Orchestrator" },
      quentin: { name: "Quentin", emoji: "🎬", role: "Video Editor" },
      linus: { name: "Linus", emoji: "🐧", role: "CTO / Lead Dev" },
    };
    const fallback = FALLBACKS[id] || { name: id, emoji: "🤖", role: "Agent" };

    return NextResponse.json({
      id,
      name: parsed.name || fallback.name,
      emoji: parsed.emoji || fallback.emoji,
      role: parsed.role || fallback.role,
      files: {
        identity: identityContent,
        soul: readFileSafe(join(workspace, "SOUL.md")),
        memory: readFileSafe(join(workspace, "MEMORY.md")),
        agents: readFileSafe(join(workspace, "AGENTS.md")),
        tools: readFileSafe(join(workspace, "TOOLS.md")),
      },
      config: agentConfig,
    });
  } catch {
    return NextResponse.json({ error: "Failed to read agent data" }, { status: 500 });
  }
}
