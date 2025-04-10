export type FetchResponse<RespponseType> = SuccessResponseBody<RespponseType> | ErrorResponseBody<ApiException>;

export interface ApiException {
  message: string;
  code?: string;
}

type ErrorResponseBody<T> = {
  type: 'ERROR';
  status: number;
  apiException: T;
};

type SuccessResponseBody<ResponseType> = {
  type: 'SUCCESS';
  data: ResponseType;
};

export const isError = (res: FetchResponse<unknown>): res is ErrorResponseBody<ApiException> => res.type === 'ERROR';

export const isSuccess = <T>(res: FetchResponse<T>): res is SuccessResponseBody<T> => res.type === 'SUCCESS';
