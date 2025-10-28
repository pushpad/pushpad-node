import type { PushpadOptions } from './Options';
import type { NotificationResource } from './NotificationResource';
import type { SubscriptionResource } from './SubscriptionResource';
import type { ProjectResource } from './ProjectResource';
import type { SenderResource } from './SenderResource';

declare class Pushpad {
  constructor(options: PushpadOptions);
  notification: NotificationResource;
  subscription: SubscriptionResource;
  project: ProjectResource;
  sender: SenderResource;
  signatureFor(data: string): string;
}

export default Pushpad;
export { Pushpad };
