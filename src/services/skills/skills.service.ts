import {apiClient} from '../api/client-instance';
import {useApiMock} from '../api/runtime-config';
import {mockSkillList} from '../mock/skills';
import type {SkillAudience, SkillDetail, SkillListResponse} from '../types';

export interface SkillListQuery {
  category?: string;
  audience?: SkillAudience;
  page?: number;
  size?: number;
}

export class SkillsService {
  async list(query: SkillListQuery = {}): Promise<SkillListResponse> {
    if (useApiMock) return {...mockSkillList, page: query.page ?? 1, size: query.size ?? 50};

    const params = new URLSearchParams();
    if (query.category) params.set('category', query.category);
    if (query.audience) params.set('audience', query.audience);
    if (query.page !== undefined) params.set('page', String(query.page));
    if (query.size !== undefined) params.set('size', String(query.size));
    const suffix = params.size ? `?${params.toString()}` : '';
    return apiClient.get<SkillListResponse>(`/api/skills${suffix}`);
  }

  get(code: string): Promise<SkillDetail> {
    if (!useApiMock) return apiClient.get<SkillDetail>(`/api/skills/${encodeURIComponent(code)}`);
    return Promise.reject(new Error('Mock 模式当前没有该 Skill 的详情数据。'));
  }
}

export const skillsService = new SkillsService();
