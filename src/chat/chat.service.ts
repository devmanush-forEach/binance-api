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
    orderId: string,
  ): Promise<Message> {
    const newMessage = new this.messageModel({
      sender,
      recipient,
      content,
      orderId,
    });
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
