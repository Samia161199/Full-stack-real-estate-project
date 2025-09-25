import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  private messages = []; // Temporary in-memory storage, replace with DB logic

  async saveMessage(messageData: {
    message: string;
    sender: string;
    recipient: string;
  }) {
    this.messages.push(messageData);
    return { success: true, message: 'Message sent successfully!' };
  }

  async getMessages() {
    return this.messages;
  }
}
