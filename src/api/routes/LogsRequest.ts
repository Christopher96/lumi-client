import { API, DefaultServerResponse } from '../API';

export interface LogsQueryParams {
  reverse?: '1' | '0';
  offset?: string;
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
    const params = new URLSearchParams({ ...(config || {}), amount: '' + amount });
    return new API().get<LogsRequestResponse>('/log/all?' + params.toString());
  }
  static getLog(id: string, amount: number, config?: LogsQueryParams) {
    const params = new URLSearchParams({ ...(config || {}), amount: '' + amount });
    return new API().get<LogsRequestResponse>(`/log/${id}?` + params.toString());
  }
}
