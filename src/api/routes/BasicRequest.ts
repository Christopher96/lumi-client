import { API } from '../API';

export class BasicRequest {
  static ping() {
    return new API().status('/');
  }
}
