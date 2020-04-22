import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';

export enum RouteParamsTypes {
  'STRING' = 'STRING',
  'NUMBER' = 'NUMBER',
  'BOOLEAN' = 'BOOLEAN'
}

export type RouteParams = {
  [key: string]: {
    optional: boolean;
    type: RouteParamsTypes;
  };
};

export type ParsedReq<T> = {
  params: T;
  args: string[];
};

type Method = 'GET';

export abstract class Route {
  protected abstract readonly description: string;
  protected abstract readonly name: string;
  protected abstract readonly shortName: string;
  protected readonly params?: RouteParams;
  protected readonly method?: Method;
  protected abstract readonly numberOfArguments: number;
  protected abstract exec(
    req: Request<ParamsDictionary, any, any, Query>,
    res: Response<any>,
    next: NextFunction
  ): void;

  protected parseReq<T extends ParamsDictionary>(req: Request<ParamsDictionary, any, any, Query>): ParsedReq<T> {
    const args = Object.values(req.params);
    const params = req.query as T;

    return {
      args,
      params
    };
  }

  public getPath(): { url: string; shortUrl: string } {
    const argsAddOn = new Array(this.numberOfArguments)
      .fill(1)
      .map((_, i) => '/:' + i)
      .join('');

    return {
      shortUrl: this.shortName + argsAddOn,
      url: this.name + argsAddOn
    };
  }

  public getMethod(): Method {
    return this.method || 'GET';
  }

  public callExec() {
    return (req: Request<ParamsDictionary, any, any, Query>, res: Response<any>, next: NextFunction) =>
      this.exec(req, res, next);
  }
}
