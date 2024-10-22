import { Request } from 'express';
import { Role } from 'src/user/dto/user.dto';

export interface RequestWithUser extends Request {
  user: {
    id: string;
    roles: Role[];
  };
}
