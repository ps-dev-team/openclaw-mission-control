'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Code2, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Panel, EmptyState, LoadingSpinner } from '@/components/panel';
import { fetchFile, fetchFileList } from '@/app/actions';

interface ParsedSkill {
  name: string;
  description: string;
  location: string;
}

export default function SkillsPage() {
  const params = useParams();
  const agentId = params.id as string;
  const [skills, setSkills] = useState<ParsedSkill[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSkills = useCallback(async () => {
    try {
      const files = await fetchFileList(agentId, 'skills');
      const skillDirs = Array.isArray(files) ? (files as string[]) : [];
      const loaded: ParsedSkill[] = [];
      for (const dir of skillDirs) {
        try {
          const content = await fetchFile(agentId, `skills/${dir}/SKILL.md`);
          if (content) {
            const nameMatch = content.match(/^name:\s*(.+)$/m);
            const descMatch = content.match(/^description:\s*(.+)$/m);
            loaded.push({
              name: nameMatch?.[1]?.trim() || dir,
              description: descMatch?.[1]?.trim() || 'No description',
              location: `skills/${dir}/SKILL.md`,
            });
          }
        } catch {
          loaded.push({
            name: dir,
            description: 'Could not load skill info',
            location: `skills/${dir}`,
          });
        }
      }
      setSkills(loaded.sort((a, b) => a.name.localeCompare(b.name)));
    } catch {
      // ignore
    }
    setLoading(false);
  }, [agentId]);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-3 text-xl font-bold">
          <Code2 className="h-6 w-6 text-chart-1" />
          Skills
        </h1>
        <Badge variant="secondary">{skills.length} installed</Badge>
      </div>

      {skills.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {skills.map((skill) => (
            <Panel
              key={skill.name}
              title={skill.name}
              icon={<Package className="h-4 w-4" />}
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                {skill.description}
              </p>
              <p className="mt-2 text-xs text-muted-foreground font-mono">
                {skill.location}
              </p>
            </Panel>
          ))}
        </div>
      ) : (
        <Panel title="Skills" icon={<Code2 className="h-4 w-4" />}>
          <EmptyState
            icon={<Code2 className="h-6 w-6" />}
            title="No Skills Found"
            description="No skills directory found or it's empty."
          />
        </Panel>
      )}
    </div>
  );
}
