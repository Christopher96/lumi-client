import { Route, RouteParamsTypes } from './route';
import { Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';

/**
 */
export class YourRoute extends Route {
  protected readonly name = 'version';
  protected readonly shortName = 'v';
  protected readonly description = 'this is an auto generated desc. Please change me';
  protected readonly numberOfArguments = 0;

  private getVersion() {
    return;
  }

  public exec(req: Request<ParamsDictionary, any, any, Query>, res: Response): void {
    const event = this.parseReq<null>(req);
    const { args } = event;
    const localVersion = process.env.BUILD_VERSION;
    const apiVersion = res.send({ localVersion, apiVersion });
  }
}
