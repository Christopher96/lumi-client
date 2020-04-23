import { Route, RouteParamsTypes } from './route';
import { Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { RestHandler } from '../../rest-handler';

/**
 */
export class VersionRoute extends Route {
  protected readonly name = 'version';
  protected readonly shortName = 'v';
  protected readonly description = 'this is an auto generated desc. Please change me';
  protected readonly numberOfArguments = 0;

  private getApiVersion(): Promise<string> {
    return new RestHandler().getVersion();
  }

  public async exec(_: Request<ParamsDictionary, any, any, Query>, res: Response): Promise<void> {
    const localVersion = process.env.BUILD_VERSION || 'NO_VERSION_SPECIFIED';
    const apiVersion = await this.getApiVersion();

    res.send({ localVersion, apiVersion });
  }
}
