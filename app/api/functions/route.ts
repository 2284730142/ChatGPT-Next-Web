import { NextRequest, NextResponse } from "next/server";
import PluginRegistry from "@/app/plugins/register";

async function handle(req: NextRequest, res: NextResponse) {
  const plugin_registry = PluginRegistry.getInstance();
  // 过滤返回到前端的插件属性
  // console.log('plugin_registry', plugin_registry.getPlugins());
  const plugins = plugin_registry.getPlugins();
  const functions: any[] = [];
  Object.keys(plugin_registry.getPlugins()).forEach((item) => {
    const plugin = plugins[item];
    if (plugin.enable) {
      functions.push({
        key: plugin.plugin_name,
        name_cn: plugin.plugin_name_cn,
        description_cn: plugin.plugin_description_cn,
        icon: plugin.plugin_icon,
        mask: plugin.plugin_mask,
        function_params: {
          name: plugin.plugin_name,
          description: plugin.plugin_description,
          parameters: plugin.plugin_parameters,
        },
      });
    }
  });
  return NextResponse.json({ functions: functions });
}

export const GET = handle;
export const POST = handle;
