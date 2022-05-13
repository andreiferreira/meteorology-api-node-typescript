import { ClassMiddleware, Controller, Get } from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { Beach } from '@src/models/beach';
import { Forecast } from '@src/services/forecast';
import { Request, Response } from 'express';

const forecastService = new Forecast();

@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForecastController {
  @Get('')
  public async getForecastForLoggedUser(req: Request, response: Response): Promise<void> {
    try {
      const beaches = await Beach.find({user: req.decoded?.id});
      const forecastData = await forecastService.processForecastForBeaches(beaches);
      response.status(200).send(forecastData);
    } catch (error) {
      response.status(500).send({ error: 'Something went wrong' });
    }
  }
}