import { Route, RouteParamsTypes } from './route';
import { Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { RestHandler } from '@src/rest-handler';

/**
 */
export class VersionRoute extends Route {
  protected readonly name = 'version';
  protected readonly shortName = 'v';
  protected readonly description = 'this is an auto generated desc. Please change me';
  protected readonly numberOfArguments = 0;

  protected readonly params = {
    api: {
      optional: true,
      type: RouteParamsTypes.BOOLEAN
    },
    local: {
      optional: true,
      type: RouteParamsTypes.BOOLEAN
    }
  };

  private getApiVersion(): Promise<string> {
    return new RestHandler().getVersion();
  }

  public async exec(req: Request<ParamsDictionary, any, any, Query>, res: Response): Promise<void> {
    const event = this.parseReq<{ local: string; api: string }>(req);
    const { params } = event;

    const localVersion = process.env.BUILD_VERSION || 'NO_VERSION_SPECIFIED';
    const apiVersion = await this.getApiVersion();

    // If no params are provided we send both or if both are declared
    if (!params || (params.local && params.api)) {
      res.send(`Local version : ${localVersion} and API version: ${apiVersion}`);
      return;
    }

    if (params.local) {
      res.send(`Local version : ${localVersion}`);
      return;
    }

    if (params.api) {
      res.send(`API version: ${apiVersion}`);
      return;
    }
  }
}
