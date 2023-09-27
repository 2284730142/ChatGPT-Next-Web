import { NextRequest, NextResponse } from "next/server";

async function handle(req: NextRequest, res: NextResponse, params: any) {
  const body = await req.json();

  console.log("[Function Call] params ", body);

  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  const { name, arguments: _arguments } = body;
  if (!name || !_arguments) return NextResponse.json({}, { status: 200 });
  // 测试用
  if (name === "get_current_weather") {
    try {
      const { location, unit } = JSON.parse(_arguments);
      return NextResponse.json(
        {
          weather_info: {
            location: location,
            temperature: "72",
            unit: unit,
            forecast: ["sunny", "windy"],
          },
        },
        { status: 200 },
      );
    } catch (e) {
      return NextResponse.json({}, { status: 200 });
    }
  }

  // TODO: call function 调用对应的api来实现，有些可以配置为本地函数

  return NextResponse.json({ params: body }, { status: 200 });
}

export const GET = handle;
export const POST = handle;
