import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, RestaurantsModule, PrismaModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
