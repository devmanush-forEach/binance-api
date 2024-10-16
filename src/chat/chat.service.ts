import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  // Updated method to accept a single object as a parameter
  async createMessage(messageData: {
    sender: string;
    recipient: string;
    content: string;
    orderId: string;
    fileUrl?: string; // Optional field for file URL
  }): Promise<Message> {
    const newMessage = new this.messageModel(messageData);
    return newMessage.save();
  }

  async getMessages(
    sender: string,
    recipient: string,
    orderId: string,
  ): Promise<Message[]> {
    return this.messageModel
      .find({
        $and: [
          {
            $or: [
              { sender: sender, recipient: recipient },
              { sender: recipient, recipient: sender },
            ],
          },
          { orderId: orderId },
        ],
      })
      .sort({ createdAt: 1 })
      .exec();
  }
}
