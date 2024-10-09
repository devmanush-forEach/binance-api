import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Admin connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Admin disconnected: ${client.id}`);
  }

  sendNewOrderNotification(orderData: any) {
    this.server.emit('newOrder', orderData);
  }

  sendWithdrawalRequestNotification(withdrawalData: any) {
    this.server.emit('newWithdrawalRequest', withdrawalData);
  }

  sendDepositRequestNotification(depositData: any) {
    console.log('90000000000000000000000000000');
    this.server.emit('newDepositRequest', depositData);
  }
}
