import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':sender/:recipient/:orderId')
  async getMessages(
    @Param('sender') sender: string,
    @Param('recipient') recipient: string,
    @Param('orderId') orderId: string,
  ) {
    return this.chatService.getMessages(sender, recipient, orderId);
  }
}
