import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { OutboxService } from '@ecommerce/common';
import { UserOutboxPublisher } from './user-outbox.publisher';

@Injectable()
export class UserOutboxPoller implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(UserOutboxPoller.name);
  private timer?: NodeJS.Timeout;

  constructor(
    private readonly outboxService: OutboxService,
    private readonly publisher: UserOutboxPublisher,
  ) {}

  onModuleInit(): void {
    this.timer = setInterval(() => void this.poll(), 2000);
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  async poll(): Promise<void> {
    try {
      await this.outboxService.pollAndPublish(this.publisher);
    } catch (error) {
      this.logger.error(`User outbox poll failed: ${(error as Error).message}`);
    }
  }
}