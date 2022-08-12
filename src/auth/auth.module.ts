import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constants/jwtConstants';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '15m' },
    })
  ],
  providers: [AuthService]
})
export class AuthModule {}
