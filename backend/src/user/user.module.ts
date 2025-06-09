import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DbService } from '../db.service';

@Module({
  // NO TypeOrmModule.forFeature here
  providers: [UserService, DbService],
  exports: [UserService],
})
export class UserModule {}