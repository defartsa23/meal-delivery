import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info, context) {
      return user;
    }
}