import { Console } from '../lib/utils/Console';
import { API } from '../api/API';

export const getJesse = async () => {
  Console.title('getting Jesse from database');
  const response = await API.PersonelRequest.getJesse();
  Console.success(response);
};
