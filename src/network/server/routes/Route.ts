import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';

/**
 * This will be used for validation in the future
 */
export enum RouteParamsTypes {
  'STRING' = 'STRING',
  'NUMBER' = 'NUMBER',
  'BOOLEAN' = 'BOOLEAN'
}

/**
 * We use this type to force a certain style on the parameters
 * config object.
 */
export type RouteParams = {
  [key: string]: {
    optional: boolean;
    type: RouteParamsTypes;
    description?: string;
  };
};

/**
 * Used object which describes the parsed req.
 */
export type ParsedReq<T> = {
  params: T;
  args: string[];
};

/**
 * Methods allowed on the request. Perhaps overkill
 * for now since get it the only one aswell as the
 * default. But perhaps we want the possibility in the
 * future to add POST, PUT, DELETE to make the API easy
 * to work with.
 */
type Method = 'GET';

export default abstract class Route {
  /**
   * Keeps track on all the registered routes
   */
  private static allRoutes: Map<string, Route> = new Map();
  /**
   * This is the description for the route. This will be used
   * with the help command.
   */
  protected abstract readonly description: string;
  /**
   * Every route requires a name. This the route on the server
   * aswell as the name of the command.
   */
  protected abstract readonly name: string;
  /**
   * The short name which can be used as well as the long name.
   */
  protected abstract readonly shortName: string;
  /**
   * The parameters which is used by the route. These are given
   * are query params when using the server.
   */
  protected readonly params?: RouteParams;
  /**
   *
   */
  protected abstract readonly numberOfArguments: number;
  /**
   * The parameters which is used by the route. These are given
   * are query params when using the server.
   */
  protected readonly method?: Method;

  register(): void {
    const name = this.getName();

    if (Route.allRoutes.has(name)) {
      throw new Error('You are not allowed to add more than one with the same name: ' + name);
    } else {
      Route.allRoutes.set(name, this);
    }
  }

  public getName(): string {
    return this.name;
  }

  protected abstract exec(
    req: Request<ParamsDictionary, any, any, Query>,
    res: Response<any>,
    next: NextFunction
  ): void;

  /**
   * Helper function which takes the HTTP request from the
   * user and retrieve the infromation we are looking for.
   *
   * @param req the http request provided by express.
   */
  protected parseReq<T extends ParamsDictionary>(req: Request<ParamsDictionary, any, any, Query>): ParsedReq<T> {
    const args = Object.values(req.params);
    const params = Object.keys(req.query).length > 0 && (req.query as T);

    return {
      args,
      params
    };
  }

  /**
   * Buils a path for the object. Builds one path for the short name
   * and one path for the long name.
   * Also make sure that the route includes the arguments paths.
   *
   * example : path = "echo" with one arument => "/echo/:args0"
   *
   * Which pretty much just tells the express server that :args0 can be
   * almost anything and the we can use that value.
   *
   */
  public getPath(): { url: string; shortUrl: string } {
    const argsAddOn = new Array(this.numberOfArguments)
      .fill(1)
      .map((_, i) => '/:args' + i)
      .join('');

    return {
      shortUrl: this.shortName + argsAddOn,
      url: this.name + argsAddOn
    };
  }

  /**
   * Checks if we have declared a method otherwise return GET as fallback.
   */
  public getMethod(): Method {
    return this.method || 'GET';
  }

  /**
   * Calls the exec function. Used to bind the class aswell as provide
   * us a easy way to add loggin when registering.
   */
  public callExec() {
    return (req: Request<ParamsDictionary, any, any, Query>, res: Response<any>, next: NextFunction) =>
      this.exec(req, res, next);
  }

  public static checkIfIsParam(paramOrArgument: string): [boolean, string] {
    const isParam = paramOrArgument[0] == '-';

    if (isParam) {
      if (paramOrArgument.includes('--')) {
        return [true, paramOrArgument.replace('--', '')];
      } else {
        return [true, paramOrArgument.replace('-', '')];
      }
    }

    return [false, paramOrArgument];
  }

  public static getUrlFromArgsAndOptions(args: string[], options: Record<string, string>): string {
    const urlParam = new URLSearchParams();
    let hasParams = false;
    for (const i in options) {
      hasParams = true;
      urlParam.set(i, options[i]);
    }
    return `${args.join('/')}${hasParams ? '?' : ''}${urlParam.toString()}`;
  }

  public static getUrlFromCommands(commands: string[] | string): string {
    const joinedCommands = Array.isArray(commands) ? commands.join(' ') : commands;
    const wordsInCommand = joinedCommands.split(' ');
    const args = [];
    const params: Record<string, string> = {};

    while (wordsInCommand.length > 0) {
      const command = wordsInCommand.shift();
      const [isParam, parsedParam] = Route.checkIfIsParam(command);

      if (isParam) {
        const nextArgument = wordsInCommand.shift();

        if (!nextArgument) {
          params[parsedParam] = 'true';
          continue;
        }

        const [nextArgumentIsParam] = Route.checkIfIsParam(nextArgument);

        if (nextArgumentIsParam) {
          params[parsedParam] = 'true';
          wordsInCommand.unshift(nextArgument);
          continue;
        }

        params[parsedParam] = nextArgument;
      } else {
        args.push(command);
      }
    }

    return Route.getUrlFromArgsAndOptions(args, params);
  }
}