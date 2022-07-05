import { Controller } from '@nestjs/common';

import { MessageService } from './message.service';

@Controller('/:workspace/:channel/messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  createMessage() {}

  updateMessage() {}

  deleteMessage() {}

  findMessageById() {}
}
