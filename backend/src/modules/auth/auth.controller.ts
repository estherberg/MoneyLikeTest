import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
} from "@nestjs/common";
import { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto } from "./dto";
import { JwtAuthGuard } from "./jwt.guard";
import { Public } from "./public.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password, dto.role);
  }


  @Public()
  @Post("login")
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, user } = await this.auth.login(
      dto.email,
      dto.password
    );

  
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax", 
      path: "/",
      maxAge: 1000 * 60 * 60 * 12,
    });

   
    return { user, accessToken };
  }

  @Public()
  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@Req() req: Request) {
    return { user: req.user };
  }

  @Public()
  @Get("health")
  health() {
    return { ok: true, service: "auth" };
  }
}
