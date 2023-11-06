import request from './request';

export const createMock = async (param: any): Promise<void> => {
  try {
    const { data } = await request.post<void>(
      'api/v1/create-mock',
      param
    );

    return data;
  } catch (error: any) {
    throw error;
  }
};