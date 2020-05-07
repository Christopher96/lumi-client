import { Console } from '../lib/utils/Console';
import { API } from '../api';
import { LogsQueryParams } from '../api/routes/LogsRequest';

export const logsCommand = async (idOrAll: string, args: { amount: string; offset?: string; reverse?: boolean }) => {
  const viewAllRooms = idOrAll === 'all';
  const amount = Number.parseInt(args.amount) || 5;
  const { offset, reverse } = args;
  const config = {} as LogsQueryParams;
  if (offset) config.offset = offset;
  if (reverse) config.reverse = '1';

  if (viewAllRooms) Console.title('Viewing logs for all rooms');
  else Console.title('Viewing logs room for', idOrAll);

  if (viewAllLogs) await viewAllLogs(amount, config);
  else await viewLogsForSingle(idOrAll, amount, config);
};

const viewAllLogs = async (amount: number, config: LogsQueryParams) => {
  const allLogs = await API.LogsRequest.getAllLogs(amount, config);

  const list = allLogs.logs.map(
    v => `> ${v.event}, ${new Date(v.date).toLocaleString()} in room ${v.roomId} by ${v.byWhom?.username || 'unknown'}`
  );

  Console.blue(list.join('\n'));
};

const viewLogsForSingle = async (id: string, amount: number, config: LogsQueryParams) => {
  const allLogs = await API.LogsRequest.getLog(id, amount, config);
  const list = allLogs.logs.map(
    v => `> ${v.event}, ${new Date(v.date).toLocaleString()} in room ${v.roomId} by ${v.byWhom?.username || 'unknown'}`
  );

  Console.blue(list.join('\n'));
};
