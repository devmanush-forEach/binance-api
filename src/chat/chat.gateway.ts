import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { AwsService } from 'src/aws/aws.service';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly awsService: AwsService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    console.log(`Client ${client.id} joined room: ${room}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: {
      sender: string;
      recipient: string;
      orderId: string;
      content?: string;
      image?: any;
    },
  ) {
    const { sender, recipient, content, orderId, image } = payload;

    let messageData = {
      sender,
      recipient,
      orderId,
      content: content || '',
      fileUrl: undefined,
    };

    if (content && image) {
      try {
        messageData.fileUrl = await this.awsService.uploadFile(image);
        messageData.content = content;

        const message = await this.chatService.createMessage(messageData);
        this.server.to(recipient).emit('receiveMessage', message);
        this.server.to(sender).emit('receiveMessage', message);
      } catch (error) {
        console.error('Error uploading image:', error);
        client.emit('uploadError', { error: 'Image upload failed.' });
        return;
      }
    } else if (content) {
      const message = await this.chatService.createMessage(messageData);
      this.server.to(recipient).emit('receiveMessage', message);
      this.server.to(sender).emit('receiveMessage', message);
    } else if (image) {
      try {
        messageData.fileUrl = await this.awsService.uploadFile(image);
        messageData.content = '';

        const message = await this.chatService.createMessage(messageData);
        this.server.to(recipient).emit('receiveMessage', message);
        this.server.to(sender).emit('receiveMessage', message);
      } catch (error) {
        console.error('Error uploading image:', error);
        client.emit('uploadError', { error: 'Image upload failed.' });
        return;
      }
    } else {
      client.emit('error', { error: 'No content or image provided.' });
      return;
    }
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(
    client: Socket,
    payload: { sender: string; recipient: string; orderId: string },
  ) {
    const { sender, recipient, orderId } = payload;
    const messages = await this.chatService.getMessages(
      sender,
      recipient,
      orderId,
    );

    client.emit('messages', messages);
  }
}
