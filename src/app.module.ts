import { Module } from '@nestjs/common';
import { AddressModule } from './addresses/address.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PuppeteerModule } from 'nest-puppeteer';

@Module({
  imports: [PuppeteerModule.forRoot(), AddressModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
