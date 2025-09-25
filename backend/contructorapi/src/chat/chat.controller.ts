import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  async sendMessage(
    @Body('message') message: string,
    @Body('sender') sender: string,
    @Body('recipient') recipient: string,
  ) {
    // Validate recipient
    if (recipient !== 'helpcenter@gmail.com') {
      throw new Error('Invalid recipient');
    }

    // Save or process the message
    return this.chatService.saveMessage({ message, sender, recipient });
  }
}
