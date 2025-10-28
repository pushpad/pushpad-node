import type { Sender } from './Sender';

export interface SenderCreateParams extends Required<Pick<Sender, 'name'>>,
  Omit<Sender, 'id' | 'created_at'> {}

export interface SenderUpdateParams extends Partial<
  Omit<SenderCreateParams, 'vapid_private_key' | 'vapid_public_key'>
> {}

export class SenderResource {
  create(data: SenderCreateParams): Promise<Sender>;
  findAll(): Promise<Sender[]>;
  find(senderId: number): Promise<Sender>;
  update(senderId: number, data: SenderUpdateParams): Promise<Sender>;
  delete(senderId: number): Promise<void>;
}
