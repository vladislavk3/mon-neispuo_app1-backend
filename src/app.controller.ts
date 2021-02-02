import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwksGuard } from './jwks.guard'


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('unprotected-resource')
  unprotectedResource() {
    return {message:'hello unprotected resource'}
  }

  @Get('protected-resource')
  @UseGuards(JwksGuard)
  protected() {
    return {message:'hello protected resource'}
  }
}
