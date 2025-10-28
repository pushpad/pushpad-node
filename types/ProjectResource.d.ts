import type { Project } from './Project';

export interface ProjectCreateParams extends Required<Pick<Project, 'sender_id' | 'name' | 'website'>>,
  Omit<Project, 'id' | 'created_at'> {}

export interface ProjectUpdateParams extends Partial<Omit<ProjectCreateParams, 'sender_id'>> {}

export class ProjectResource {
  create(data: ProjectCreateParams): Promise<Project>;
  findAll(): Promise<Project[]>;
  find(projectId: number): Promise<Project>;
  update(projectId: number, data: ProjectUpdateParams): Promise<Project>;
  delete(projectId: number): Promise<void>;
}
