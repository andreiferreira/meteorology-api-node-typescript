import './util/module-alias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { Application } from 'express';
import { ForecastController } from './controllers/forecast';
import { BeachesController } from './controllers/beaches';
import { UsersController } from './controllers/users';

import * as database from '@src/database'

export class SetupServer extends Server {
  constructor(private port = 1111) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup()
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  private setupControllers(): void {
    const forecastController = new ForecastController()
    const beachesController = new BeachesController()
    const usersController = new UsersController()

    this.addControllers([forecastController, beachesController, usersController]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.info('Server listening of port:', this.port)
    })
  }

  public async close(): Promise<void> {
    await database.close()
  }

  public getApp(): Application {
    return this.app;
  }
}
