import type { Project } from './Project';

export interface ProjectCreateInput extends Required<Pick<Project, 'sender_id' | 'name' | 'website'>>,
  Omit<Project, 'id' | 'created_at'> {}

export interface ProjectUpdateInput extends Partial<Omit<ProjectCreateInput, 'sender_id'>> {}

export class ProjectResource {
  create(data: ProjectCreateInput): Promise<Project>;
  findAll(): Promise<Project[]>;
  find(projectId: number): Promise<Project>;
  update(projectId: number, data: ProjectUpdateInput): Promise<Project>;
  delete(projectId: number): Promise<void>;
}
