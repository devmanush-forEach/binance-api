import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UpiService } from './upi.service';
import { UpiController } from './upi.controller';
import { Upi, UpiSchema } from './upi.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Upi.name, schema: UpiSchema }])],
    controllers: [UpiController],
    providers: [UpiService],
})
export class UpiModule { }
