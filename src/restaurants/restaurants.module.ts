import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { jwtConstants } from 'src/common/constants/jwtConstants';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '15m' },
    })
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, JwtStrategy]
})
export class RestaurantsModule {}
