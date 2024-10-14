// src/user-badges/user-badge.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserBadgeController } from './user-badge.controller';
import { UserBadgeService } from './user-badge.service';
import { UserBadge, UserBadgeSchema } from './user-badge.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserBadge.name, schema: UserBadgeSchema },
    ]),
  ],
  controllers: [UserBadgeController],
  providers: [UserBadgeService],
})
export class UserBadgeModule {}
