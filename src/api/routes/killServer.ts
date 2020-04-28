import { Route } from './route';
import { Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';

/**
 */
export class KillServerRoute extends Route {
  protected readonly name = 'kill-server';
  protected readonly shortName = 'ks';
  protected readonly description = 'This kills the server running in the background';
  protected readonly arguments = [];

  public async exec(req: Request<ParamsDictionary, any, any, Query>, res: Response): Promise<void> {
    res.send(`Killed server...`);
    process.exit();
  }
}
