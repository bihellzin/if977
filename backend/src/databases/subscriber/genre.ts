import { EventSubscriber, EntitySubscriberInterface } from 'typeorm';

@EventSubscriber()
export class genre implements EntitySubscriberInterface<any> {}
