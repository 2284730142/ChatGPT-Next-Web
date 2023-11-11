import Plugin from "@/app/plugins/plugin";
import { Axios } from "@/app/api";

export default class GetWeatherCN extends Plugin {
  plugin_icon?: string | undefined;
  plugin_mask?: string | undefined;

  enable = true;
  plugin_name = "get_weather";
  plugin_name_cn = "获取中国境内各地的天气信息";
  plugin_description =
    "This plugin allows you to retrieve weather information for locations within China.";
  plugin_description_cn = "该插件允许您获取中国境内各地的天气信息。";

  plugin_parameters = {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "The name of a city or region",
      },
    },
    required: ["location"],
  };

  private _key = "da058534575606961bd63dcf4b2f23c5";
  // 查询地址信息 adcode TODO 缓存这个东西（次数太少）用于内部的实现，更换API其实无所谓
  private _api_place = "https://restapi.amap.com/v5/place/text";
  // 查询具体的天气信息
  private _api_whether = "https://restapi.amap.com/v3/weather/weatherInfo";

  async run({
    arg,
  }: {
    arg: any;
  }): Promise<{
    info: { [p: string]: any } | { error_message: string } | undefined | null;
  }> {
    let locations: any = await Axios.getJson(
      this._api_place,
      {
        key: this._key,
        keywords: arg.location,
        region: "adcode",
        page_size: 10,
        page_num: 1,
      },
      {},
    );
    let adcode = undefined;
    if (
      locations &&
      locations.pois &&
      locations.pois[0] &&
      locations.pois[0].adcode
    ) {
      adcode = locations.pois[0].adcode;
    }
    let whether_info = undefined;
    if (!adcode) {
      return {
        info: { error_message: "没有地理位置，暂时无法获取天气信息" },
      };
    }
    let whether_info_data: any = await Axios.getJson(
      this._api_whether,
      {
        key: this._key,
        city: adcode,
      },
      {},
    );
    // 暂时只处理实时数据
    if (
      whether_info_data &&
      whether_info_data.lives &&
      whether_info_data.lives[0]
    ) {
      whether_info = whether_info_data.lives[0];
    }
    return {
      info: whether_info,
    };
  }
}
