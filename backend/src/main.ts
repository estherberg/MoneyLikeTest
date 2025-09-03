import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(cookieParser()); 

  app.enableCors({
    origin: ["http://localhost:3000"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Accept",
      "Authorization",
      "Idempotency-Key",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT || 3001);
  console.log("API running on http://localhost:" + (process.env.PORT || 3001));
}
bootstrap();
