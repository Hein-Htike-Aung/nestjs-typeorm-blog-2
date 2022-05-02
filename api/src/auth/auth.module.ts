import { JwtStrategy } from './strategy/JwtStrategy';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { isCurrentUser } from './guards/is-current-user.guard';
import { UserSecurityService } from './service/user-security.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from './../user/models/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '999m' }
      })
    })
  ],
  providers: [AuthService, UserSecurityService, isCurrentUser, JwtAuthGuard, RolesGuard, JwtStrategy],
  exports: [AuthService, UserSecurityService]
})
export class AuthModule { }
