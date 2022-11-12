import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Controller({
  path: 'healthz',
  version: VERSION_NEUTRAL,
})
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @ApiExcludeEndpoint()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([]);
  }
}
