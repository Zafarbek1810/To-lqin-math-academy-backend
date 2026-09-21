import { Module } from '@nestjs/common';
import { JwtModule, type JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { getJwtSecret } from '../common/config';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    // MUHIM: `registerAsync` ishlatilgan, chunki bu modul `AppModule` dagi
    // `ConfigModule.forRoot()` dan OLDIN yuklanadi. `register()` bo'lsa
    // `.env` hali process.env ga o'qilmagan bo'ladi va JWT_SECRET topilmaydi.
    // `useFactory` esa DI bosqichida, ya'ni .env yuklangandan keyin ishlaydi.
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: getJwtSecret(),
        signOptions: {
          expiresIn: (process.env.JWT_EXPIRES_IN ||
            '7d') as JwtSignOptions['expiresIn'],
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
