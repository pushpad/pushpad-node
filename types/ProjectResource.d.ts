import type { Project } from './Project';

export interface ProjectCreateParams {
  sender_id: number;
  name: string;
  website: string;
  icon_url?: string;
  badge_url?: string;
  notifications_ttl?: number;
  notifications_require_interaction?: boolean;
  notifications_silent?: boolean;
}

export interface ProjectUpdateParams {
  name?: string;
  website?: string;
  icon_url?: string;
  badge_url?: string;
  notifications_ttl?: number;
  notifications_require_interaction?: boolean;
  notifications_silent?: boolean;
}

export class ProjectResource {
  create(data: ProjectCreateParams): Promise<Project>;
  findAll(): Promise<Project[]>;
  find(projectId: number): Promise<Project>;
  update(projectId: number, data: ProjectUpdateParams): Promise<Project>;
  delete(projectId: number): Promise<void>;
}
