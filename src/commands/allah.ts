import { Console } from '../lib/utils/Console';
import { API } from '../api/API';

export const allahCommand = async (bomb: string) => {
  const serverResponse = await API.BasicRequest.allah(bomb);
  Console.error('\n' + serverResponse.your_bomb);
};
