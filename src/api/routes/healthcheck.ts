import { Route, RouteParamsTypes } from './route';
import { Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';

/**
 */
export class HealthCheckRoute extends Route {
  protected readonly name = 'healthcheck';
  protected readonly shortName = 'hc';
  protected readonly description = 'Checks if the server is up and running';
  protected readonly arguments = [];

  public async exec(req: Request<ParamsDictionary, any, any, Query>, res: Response): Promise<void> {
    res.send(`❤️`);
  }
}
