import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async createMessage(
    sender: string,
    recipient: string,
    content: string,
  ): Promise<Message> {
    const newMessage = new this.messageModel({ sender, recipient, content });
    return newMessage.save();
  }

  async getMessages(sender: string, recipient: string): Promise<Message[]> {
    return this.messageModel
      .find({
        $or: [
          { sender, recipient },
          { sender: recipient, recipient: sender },
        ],
      })
      .sort({ createdAt: 1 }) // Order by creation time
      .exec();
  }
}
