// index.ts
import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { baseURL } from "@/contents/utils";

type Result<T> = {
  code: number;
  message: string;
  data: T;
};

// 导出Request类，可以用来自定义传递配置来创建实例
export class Request {
  // axios 实例
  instance: AxiosInstance;
  // 基础配置，url和超时时间
  baseConfig: AxiosRequestConfig = { baseURL: baseURL, timeout: 60000 };

  constructor(config: AxiosRequestConfig) {
    // 使用axios.create创建axios实例
    this.instance = axios.create(Object.assign(this.baseConfig, config));

    this.instance.interceptors.request.use(
      (config: any) => {
        // 一般会请求拦截里面加token，用于后端的验证
        const token = localStorage.getItem("system_token") as string

        if (token) {
          config.headers!.Authorization = token;
        }

        return config;
      },
      (err: any) => {
        // 请求错误，这里可以用全局提示框进行提示
        return Promise.reject(err);
      }
    );

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        // 直接返回res，当然你也可以只返回res.data
        // 系统如果有自定义code也可以在这里处理
        const responseData = res.data
        if (responseData.code === 200) {
          return res.data;
        } else {
          const message = this.handleErr(responseData.code)
          return Promise.reject(message);
        }
      },
      (err: any) => {
        const message = this.handleErr(err.response.status)
        return Promise.reject(message);
      }
    );
  }

  // 定义请求方法
  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config);
  }

  // 错误处理方法
  public handleErr(status: number) {
    let message = "";

    switch (status) {
      case 400:
        message = "请求错误(400)";
        break;
      case 401:
        message = "未授权，请重新登录(401)";
        // 这里可以做清空storage并跳转到登录页的操作
        break;
      case 403:
        message = "拒绝访问(403)";
        break;
      case 404:
        message = "请求出错(404)";
        break;
      case 408:
        message = "请求超时(408)";
        break;
      case 500:
        message = "服务器错误(500)";
        break;
      case 501:
        message = "服务未实现(501)";
        break;
      case 502:
        message = "网络错误(502)";
        break;
      case 503:
        message = "服务不可用(503)";
        break;
      case 504:
        message = "网络超时(504)";
        break;
      case 505:
        message = "HTTP版本不受支持(505)";
        break;
      default:
        message = `连接出错(${status})!`;
    }
    return message
  }
}

// 默认导出Request实例
export default new Request({})
