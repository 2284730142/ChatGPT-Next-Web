import { Axios } from "@/app/api";

abstract class Plugin {
  // 插件的icon标识
  abstract plugin_icon?: string;
  // 标识插件是否可用
  abstract enable: boolean;

  // 实现插件名称 CN表示界面显示
  abstract plugin_name: string;
  abstract plugin_name_cn: string;
  // 插件的描述信息  CN表示界面显示
  abstract plugin_description: string;
  abstract plugin_description_cn: string;
  abstract plugin_parameters: { [p: string]: any };

  // TODO 插件附带的系统消息设定，可以附带，也可以不附带，仅用于选用到特定插件进行特定内容输出时重要
  abstract plugin_mask?: string;

  // 插件的调用api地址
  // abstract api: string;

  // TODO 开启认证处理
  // auth

  // TODO 类型处理，api处理
  // abstract plugin_type: 'api';

  // 必须实现执行的函数，且返回值必须调整为info...
  abstract run<T>({
    arg,
  }: {
    arg: T;
  }): Promise<{
    info: { [p: string]: any } | { error_message: string } | undefined | null;
  }>;

  // 可以在基类中定义其他共享的函数和逻辑
}

export default Plugin;
