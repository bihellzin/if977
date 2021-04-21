import {EventSubscriber, EntitySubscriberInterface} from "typeorm";

@EventSubscriber()
export class music implements EntitySubscriberInterface<any> {

}
