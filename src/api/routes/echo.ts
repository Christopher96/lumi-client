import { Route, RouteParamsTypes } from './route';
import { Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';

/*i
 * Class which echos the response from the user
 * mainly used for testing.
 */
export class EchoRoute extends Route {
  /**
   * This is the description for the route. This will be used
   * with the help command.
   */
  protected readonly description = 'This echos the response';
  /**
   * Every route requires a name. This the route on the server
   * aswell as the name of the command.
   */
  protected readonly name = 'echo';
  /**
   * The short name which can be used as well as the long name.
   */
  protected readonly shortName = 'e';
  /**
   * The parameters which is used by the route. These are given
   * are query params when using the server.
   */
  protected readonly params = {
    repeat: {
      optional: true,
      type: RouteParamsTypes.NUMBER
    },
    reverse: {
      optional: true,
      type: RouteParamsTypes.BOOLEAN
    }
  };

  /**
   * The number of argument which is needed with this route.
   * These are represented as subroutes in the url
   *
   * ex : echo/my-phrase
   */
  protected readonly numberOfArguments = 1;

  /**
   * Function which is called when executing the route. Looks
   * at the args string and repeats it and reverses it if it
   * is set to reversed.
   *
   * @param req the request from the user
   * @param res a helper object which can send information to
   * the user.
   */
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
