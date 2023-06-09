import { NestFactory } from '@nestjs/core';
const cookieSession = require('cookie-session');

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(
        cookieSession({
            keys: ['asdf'],
        })
    );

    await app.listen(process.env.PORT || 3000);
}
bootstrap();
