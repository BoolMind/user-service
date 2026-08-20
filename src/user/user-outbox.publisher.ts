import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OutboxEntity, OutboxPublisher } from '@ecommerce/common';

@Injectable()
export class UserOutboxPublisher implements OutboxPublisher {
  constructor(
    @Inject('USER_EVENTS_PRODUCER')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async publish(entry: OutboxEntity): Promise<void> {
    const [, topic] = entry.destination.split(':');

    await firstValueFrom(
      this.kafkaClient.emit(topic, {
        key: entry.aggregateId,
        value: entry.payload,
      }),
    );
  }
}