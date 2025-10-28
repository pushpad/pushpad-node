import type { Sender } from './Sender';

export interface SenderCreateInput extends Required<Pick<Sender, 'name'>>,
  Omit<Sender, 'id' | 'created_at'> {}

export interface SenderUpdateInput extends Partial<
  Omit<SenderCreateInput, 'vapid_private_key' | 'vapid_public_key'>
> {}

export class SenderResource {
  create(data: SenderCreateInput): Promise<Sender>;
  findAll(): Promise<Sender[]>;
  find(senderId: number): Promise<Sender>;
  update(senderId: number, data: SenderUpdateInput): Promise<Sender>;
  delete(senderId: number): Promise<void>;
}
