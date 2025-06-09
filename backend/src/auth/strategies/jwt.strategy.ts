import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config'; // Import the ConfigService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Inject the ConfigService into the constructor
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Use the injected service to get the same secret key
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // This function runs only AFTER the token has been successfully verified
  async validate(payload: any) {
    // The decoded payload is passed here. We return it to be attached to the request object.
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}