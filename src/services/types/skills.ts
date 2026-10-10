/** Types mirror the read-only Skill responses in server/docs/api.md. */
export type SkillAudience = 'student' | 'teacher' | 'both';

export interface SkillSummary {
  code: string;
  name: string;
  category: string;
  audience: SkillAudience;
  description: string;
  version: number;
  updatedAt: string;
}

export interface SkillDetail extends SkillSummary {
  instructions: string;
}

export interface SkillListResponse {
  items: SkillSummary[];
  page: number;
  size: number;
  total: number;
}
