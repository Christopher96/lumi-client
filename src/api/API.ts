import httpFetch from 'node-fetch';
import { RoomRequest } from './routes/RoomRequest';
import { BasicRequest } from './routes/BasicRequest';
import FormData from 'form-data';

export type DefaultServerResponse = { message: string };
export type UserListServerResponse = { message: string; users: string[] };

export class API {
  static RoomRequest = RoomRequest;
  static BasicRequest = BasicRequest;

  public get<T>(relativePath: string) {
    return httpFetch(process.env.SERVER_ENDPOINT + relativePath).then(v => v.json() as Promise<T>);
  }

  public post<T>(relativePath: string, body: string | FormData) {
    return httpFetch(process.env.SERVER_ENDPOINT + relativePath, {
      method: 'POST',
      body
    }).then(v => v.json() as Promise<T>);
  }

  public upload<T>(relativePath: string, file: Buffer) {
    const formData = new FormData();
    formData.append('data', file);
    return this.post<T>(relativePath, formData);
  }

  public download(relativePath: string): Promise<Buffer> {
    return httpFetch(process.env.SERVER_ENDPOINT + relativePath).then(v => v.buffer());
  }

  public status(relativePath: string) {
    return httpFetch(process.env.SERVER_ENDPOINT + relativePath).then(v => ({ status: v.status }));
  }
}
