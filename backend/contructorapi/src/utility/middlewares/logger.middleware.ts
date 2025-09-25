import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      logger?: UserEntity;
    }
  }
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.accessToken; // Get token from cookies

    if (!token) {
      console.log('No token found in cookies.');
      req.logger = null;
      next();
      return;
    }

    try {
      const { id } = <JwtPayload>(
        verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
      );
      console.log('Decoded JWT:', id); // Debug: Log the decoded ID

      const logger = await this.usersService.findOne(+id);
      req.logger = logger;

      console.log('User Found:', logger); // Debug: Log the fetched user
    } catch (err) {
      console.error('JWT Verification Failed:', err); // Debug: Log any JWT errors
      req.logger = null;
    }

    next(); // Make sure next() is called after processing
  }
}

interface JwtPayload {
  id: string;
}
