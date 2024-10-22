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

  private userSockets: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    let userId = client.handshake.query.userId;
    if (typeof userId === 'string') {
      this.userSockets.set(userId, client.id);
    }
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
      image?: {
        buffer: ArrayBuffer;
        mimetype: string;
        originalname: string;
      };
    },
  ) {
    const { sender, recipient, content, orderId, image } = payload;

    console.log(image);

    let messageData = {
      sender,
      recipient,
      orderId,
      content: content || '',
      fileUrl: undefined,
    };

    try {
      if (content && image) {
        const { url } = await this.awsService.uploadFile(image);
        messageData.fileUrl = url;
        messageData.content = content;
      } else if (content) {
        messageData.content = content;
      } else if (image) {
        const { url } = await this.awsService.uploadFile(image);
        messageData.fileUrl = url;
        messageData.content = '';
      } else {
        client.emit('error', { error: 'No content or image provided.' });
        return;
      }

      const message = await this.chatService.createMessage(messageData);
      this.server.to(recipient).emit('receiveMessage', message);
      this.server.to(sender).emit('receiveMessage', message);
    } catch (error) {
      console.error('Error uploading image:', error);
      client.emit('uploadError', { error: 'Image upload failed.' });
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

  pushNotification(
    recipient: string,
    notification: { title: string; message: string; orderId: string },
  ) {
    const recipientSocketId = this.userSockets.get(recipient);
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('notification', notification);
      console.log(`Notification sent to recipient: ${recipient}`, notification);
    } else {
      console.log(`Recipient not connected: ${recipient}`);
    }
    console.log(`Notification sent to recipient: ${recipient}`, notification);
  }
}
