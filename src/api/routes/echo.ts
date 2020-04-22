import { Route, RouteParams, RouteParamsTypes } from './route';
import { Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';

export class EchoRoute extends Route {
  public description = 'This echos the response';
  public name = 'echo';
  public shortName = 'e';
  public params = {
    repeat: {
      optional: true,
      type: RouteParamsTypes.NUMBER
    },
    reverse: {
      optional: true,
      type: RouteParamsTypes.BOOLEAN
    }
  };
  public numberOfArguments = 1;

  public exec(req: Request<ParamsDictionary, any, any, Query>, res: Response): void {
    const event = this.parseReq<{ repeat: string; reverse: string }>(req);
    const { args, params } = event;
    let out = args[0];

    if (event.params.repeat) {
      out = out.repeat(Number.parseInt(params.repeat));
    }

    if (event.params.reverse) {
      out = out
        .split('')
        .reverse()
        .join('');
    }

    res.send(out);
  }
}
