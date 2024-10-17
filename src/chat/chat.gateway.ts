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

  // @SubscribeMessage('sendMessage')
  // async handleMessage(
  //   client: Socket,
  //   payload: {
  //     sender: string;
  //     recipient: string;
  //     orderId: string;
  //     content?: string;
  //     image?: any;
  //   },
  // ) {
  //   const { sender, recipient, content, orderId, image } = payload;

  //   let messageData = {
  //     sender,
  //     recipient,
  //     orderId,
  //     content: content || '',
  //     fileUrl: undefined,
  //   };

  //   if (content && image) {
  //     try {
  //       messageData.fileUrl = await this.awsService.uploadFile(image);
  //       messageData.content = content;

  //       const message = await this.chatService.createMessage(messageData);
  //       this.server.to(recipient).emit('receiveMessage', message);
  //       this.server.to(sender).emit('receiveMessage', message);
  //     } catch (error) {
  //       console.error('Error uploading image:', error);
  //       client.emit('uploadError', { error: 'Image upload failed.' });
  //       return;
  //     }
  //   } else if (content) {
  //     const message = await this.chatService.createMessage(messageData);
  //     this.server.to(recipient).emit('receiveMessage', message);
  //     this.server.to(sender).emit('receiveMessage', message);
  //   } else if (image) {
  //     try {
  //       messageData.fileUrl = await this.awsService.uploadFile(image);
  //       messageData.content = '';

  //       const message = await this.chatService.createMessage(messageData);
  //       this.server.to(recipient).emit('receiveMessage', message);
  //       this.server.to(sender).emit('receiveMessage', message);
  //     } catch (error) {
  //       console.error('Error uploading image:', error);
  //       client.emit('uploadError', { error: 'Image upload failed.' });
  //       return;
  //     }
  //   } else {
  //     client.emit('error', { error: 'No content or image provided.' });
  //     return;
  //   }
  // }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: {
      sender: string;
      recipient: string;
      orderId: string;
      content?: string;
      image?: {
        buffer: ArrayBuffer; // Expect ArrayBuffer in the image data
        mimetype: string; // File's mimetype
        originalname: string; // Original name of the file
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
        // If content and image are present, handle both
        const { url } = await this.awsService.uploadFile(image);
        messageData.fileUrl = url;

        messageData.content = content;
      } else if (content) {
        // If only content is present, no need to upload file
        messageData.content = content;
      } else if (image) {
        // If only image is present
        messageData.fileUrl = await this.awsService.uploadFile(image);
        messageData.content = '';
      } else {
        client.emit('error', { error: 'No content or image provided.' });
        return;
      }

      // Create the message in your chat service and emit it to the recipient and sender
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
}
