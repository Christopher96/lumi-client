import fetch from 'node-fetch';

type MakeReqConfig = {
  url?: string;
};

export class RestHandler {
  protected static readonly url = 'http://it-pr-itpro-duw4azjoa0r0-1588304925.eu-west-1.elb.amazonaws.com';

  protected makeReq(relativePath: string, config?: MakeReqConfig): Promise<Record<string, any> | string> {
    const url = `${config?.url || RestHandler.url}/${relativePath}`;
    return fetch(url).then(async v => {
      try {
        const json = await v.json();
        return json as Record<string, any>;
      } catch {
        const text = await v.text();
        return text;
      }
    });
  }

  protected get<T, E>(relativePath: string, config?: MakeReqConfig): Promise<T | E> {
    return this.makeReq(relativePath, config)
      .then(v => v as T)
      .catch(e => e as E);
  }

  public getVersion(): Promise<string> {
    return this.get<string, string>('version');
  }
}
