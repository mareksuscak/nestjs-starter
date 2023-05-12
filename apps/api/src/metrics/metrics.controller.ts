import { Controller, Get, Res, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { PrometheusController } from '@willsoto/nestjs-prometheus';
import { FastifyReply } from 'fastify';

@Controller({
  path: 'metrics',
  version: VERSION_NEUTRAL,
})
export class MetricsController extends PrometheusController {
  @ApiExcludeEndpoint()
  @Get()
  async index(@Res() response: FastifyReply) {
    return super.index(response);
  }
}
