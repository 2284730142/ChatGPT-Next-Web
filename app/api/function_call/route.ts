import { NextRequest, NextResponse } from "next/server";
import PluginRegistry from "@/app/plugins/register";
import { Axios } from "@/app/api";

async function handle(req: NextRequest, res: NextResponse, params: any) {
  const body = await req.json();

  console.log("[Function Call] params ", body);

  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  const { name, arguments: _arguments } = body;
  if (!name || !_arguments) return NextResponse.json({}, { status: 200 });

  let _arg = null;
  try {
    _arg = JSON.parse(_arguments);
  } catch (e) {
    console.log("请求参数解析异常", e);
    return NextResponse.json({}, { status: 500 });
  }

  // 读取当前的plugin center的配置，然后调用对应的api
  // 注册plugin center
  const plugin_registry = PluginRegistry.getInstance();
  const _func = plugin_registry.getPlugin(name);
  if (!_func) return NextResponse.json({}, { status: 200 });

  console.log("准备向第三方发起请求：", name);
  console.log("请求参数：", _arg);

  new Axios({});
  const _func_res: { info: { [p: string]: any } | undefined | null } =
    await _func.run({ arg: _arg });

  console.log("第三方请求数据结果：", _func_res);

  return NextResponse.json(_func_res, { status: 200 });
}

export const GET = handle;
export const POST = handle;
