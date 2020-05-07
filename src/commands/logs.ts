import { Console } from '../lib/utils/Console';
import { API } from '../api';

export const logsCommand = async (idOrAll: string, args: { amount: string }) => {
  const viewAllRooms = idOrAll === 'all';
  const amount = Number.parseInt(args.amount) || 5;

  if (viewAllRooms) Console.title('Viewing logs for all rooms');
  else Console.title('Viewing logs room for', idOrAll);

  if (viewAllLogs) await viewAllLogs(amount);
  else await viewLogsForSingle(idOrAll, amount);
};

const viewAllLogs = async (amount: number) => {
  const allLogs = await API.LogsRequest.getAllLogs(amount);

  const list = allLogs.logs.map(
    v => `> ${v.event}, ${new Date(v.date).toLocaleString()} in room ${v.roomId} by ${v.byWhom?.username || 'unknown'}`
  );

  Console.blue(list.join('\n'));
};

const viewLogsForSingle = async (id: string, amount: number) => {
  const allLogs = await API.LogsRequest.getLog(id, amount);
  const list = allLogs.logs.map(
    v => `> ${v.event}, ${new Date(v.date).toLocaleString()} in room ${v.roomId} by ${v.byWhom?.username || 'unknown'}`
  );

  Console.blue(list.join('\n'));
};
