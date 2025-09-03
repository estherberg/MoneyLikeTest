import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

type JwtPayload = {
  sub: string;
  email: string;
  role: 'USER' | 'ADVERTISER' | 'ADMIN';
};

function cookieExtractor(req: Request): string | null {
  return req?.cookies?.token || null; 
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,                         
        ExtractJwt.fromAuthHeaderAsBearerToken(), // fallback Authorization header
      ]),
      secretOrKey: process.env.JWT_SECRET!,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    // req.user = { sub, email, role }
    return payload;
  }
}
