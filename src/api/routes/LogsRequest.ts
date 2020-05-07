import { API, DefaultServerResponse } from '../API';

interface LogsQueryParams {
  reverse: '1' | '0';
}

type LogEvent = {
  event: string;
  date: number;
  roomId: string;
  body?: any;
  byWhom: {
    username: string;
  };
};

type LogsRequestResponse = {
  ok: boolean;
  message: string;
  logs: LogEvent[];
};

export class LogsRequest {
  static getAllLogs(amount: number, config?: LogsQueryParams) {
    const params = new URLSearchParams({ amount: '' + amount, ...(config || {}) });
    return new API().get<LogsRequestResponse>('/log/all?' + params.toString());
  }
  static getLog(id: string, amount: number, config?: LogsQueryParams) {
    const params = new URLSearchParams({ amount: '' + amount, ...(config || {}) });
    return new API().get<LogsRequestResponse>(`/log/${id}?` + params.toString());
  }
}
