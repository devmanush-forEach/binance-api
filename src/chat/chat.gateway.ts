import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

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
      content: string;
    },
  ) {
    const { sender, recipient, content, orderId } = payload;

    const message = await this.chatService.createMessage(
      sender,
      recipient,
      content,
      orderId,
    );

    this.server.to(recipient).emit('receiveMessage', message);
    this.server.to(sender).emit('receiveMessage', message);
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
