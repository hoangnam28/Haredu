export interface BaseResponseApi<T> {
  code: number;
  data: T;
  message: string;
  success: boolean;
  errors: string;
}

export interface BaseQueryRequest {
  page?: number;
  size?: number;
  text?: string;
  sortBy?: string;
  sortType?: SortTypeRequest;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface BaseResponseRecords<T> {
  page: number;
  size: number;
  total: number;
  records: T[];
}

export type SortTypeRequest = 'asc' | 'desc';
