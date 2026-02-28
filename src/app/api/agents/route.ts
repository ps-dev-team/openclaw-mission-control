import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

interface AgentIdentity {
  name: string;
  emoji: string;
  role: string;
}

function parseIdentityMd(filePath: string): Partial<AgentIdentity> {
  try {
    if (!existsSync(filePath)) return {};
    const content = readFileSync(filePath, "utf-8");
    const name = content.match(/\*\*Name:\*\*\s*(.+)/)?.[1]?.trim();
    const emoji = content.match(/\*\*Emoji:\*\*\s*(.+)/)?.[1]?.trim();
    const role = content.match(/\*\*Role:\*\*\s*(.+)/)?.[1]?.trim();
    return { name, emoji, role };
  } catch {
    return {};
  }
}

const FALLBACKS: Record<string, AgentIdentity> = {
  main: { name: "Berto", emoji: "🦞", role: "Orchestrator" },
  quentin: { name: "Quentin", emoji: "🎬", role: "Video Editor" },
  linus: { name: "Linus", emoji: "🐧", role: "CTO / Lead Dev" },
};

const WORKSPACE_MAP: Record<string, string> = {
  main: "/home/ubuntu/berto",
};

export async function GET(request: NextRequest) {
  const session = request.cookies.get("session");
  if (!session?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const configPath = join(process.env.HOME || "/root", ".openclaw", "openclaw.json");
    const config = JSON.parse(readFileSync(configPath, "utf-8"));
    const agentList = config?.agents?.list || [];
    const defaultWorkspace = config?.agents?.defaults?.workspace;

    const agents = agentList.map((a: Record<string, string>) => {
      const id = a.id;
      const fallback = FALLBACKS[id] || { name: id, emoji: "🤖", role: "Agent" };
      const workspace = a.workspace || WORKSPACE_MAP[id] || defaultWorkspace;

      let identity: Partial<AgentIdentity> = {};
      if (workspace) {
        identity = parseIdentityMd(join(workspace, "IDENTITY.md"));
      }

      return {
        id,
        name: identity.name || fallback.name,
        emoji: identity.emoji || fallback.emoji,
        role: identity.role || fallback.role,
        workspace,
      };
    });

    return NextResponse.json({ agents });
  } catch {
    return NextResponse.json({ error: "Failed to read config" }, { status: 500 });
  }
}
