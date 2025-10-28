import type { Sender } from './Sender';

export interface SenderCreateParams {
  name: string;
  vapid_private_key?: string;
  vapid_public_key?: string;
}

export interface SenderUpdateParams {
  name?: string;
}

export class SenderResource {
  create(data: SenderCreateParams): Promise<Sender>;
  findAll(): Promise<Sender[]>;
  find(senderId: number): Promise<Sender>;
  update(senderId: number, data: SenderUpdateParams): Promise<Sender>;
  delete(senderId: number): Promise<void>;
}
