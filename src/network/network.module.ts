import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NetworkService } from './network.service';
import { NetworkController } from './network.controller';
import { Network, NetworkSchema } from './network.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Network.name, schema: NetworkSchema }]),
  ],
  providers: [NetworkService],
  controllers: [NetworkController],
})
export class NetworkModule {}
