import Plugin from "./plugin";
import GetWeatherCN from "@/app/plugins/get_weather_cn.plugin";

const PLUGIN_CENTER = [GetWeatherCN];

export default class PluginRegistry {
  private static instance: PluginRegistry;
  private plugins: Record<string, Plugin> = {};

  private constructor() {
    // 私有构造函数，防止直接实例化
    this.initializePlugins();
  }

  static getInstance(): PluginRegistry {
    if (!PluginRegistry.instance) {
      PluginRegistry.instance = new PluginRegistry();
    }
    return PluginRegistry.instance;
  }

  private initializePlugins(): void {
    PLUGIN_CENTER.forEach((plugin) => {
      let _instance = new plugin();
      this.registerPlugin(_instance.plugin_name, _instance);
    });
  }

  registerPlugin(name: string, plugin: Plugin): void {
    this.plugins[name] = plugin;
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins[name];
  }

  getPlugins(): Record<string, Plugin> {
    return this.plugins;
  }

  // todo 可以添加其他插件管理的方法
}
