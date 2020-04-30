import { API } from '../API';

export class PersonelRequest {
  static getJesse() {
    return new API().get('/personel/jesse');
  }
}
