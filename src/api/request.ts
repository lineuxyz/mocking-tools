import axios, { AxiosResponse } from 'axios';

const timeout = 30000; //30 seconds

const request = axios.create({
  timeout,
});

const successResponse = (response: any): AxiosResponse => response;

request.interceptors.response.use(successResponse);

export default request;
