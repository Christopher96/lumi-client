import { API, DefaultServerResponse } from '../API';

export class BasicRequest {
  static ping() {
    return new API().status('/');
  }

  static allah(bomb) {
    return new API().get<DefaultServerResponse & { your_bomb: string }>('/personel/allah/' + bomb);
  }
}
