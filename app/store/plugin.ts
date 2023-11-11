import { DEFAULT_API_HOST, DEFAULT_MODELS, StoreKey } from "../constant";
import { getHeaders } from "../client/api";
import { getClientConfig } from "../config/client";
import { createPersistStore } from "../utils/store";

let fetchState = 0; // 0 not fetch, 1 fetching, 2 done

const DEFAULT_PLUGIN_STATE = {
  functions: [],
};

declare global {
  type PluginConfig = typeof DEFAULT_PLUGIN_STATE;
}

export const usePluginStore = createPersistStore(
  { ...DEFAULT_PLUGIN_STATE },

  (set, get) => ({
    getFunctionName(key: string): string {
      const f: any = get().functions.find((f: any) => f.key === key);
      if (f) return f.name_cn;
      return "";
    },
    updatePlugins(func: any) {
      set(() => ({
        functions: func,
      }));
    },
    fetch() {
      if (fetchState > 0 || getClientConfig()?.buildMode === "export") return;
      fetchState = 1;
      fetch("/api/functions", {
        method: "post",
        body: null,
        headers: {
          ...getHeaders(),
        },
      })
        .then((res) => res.json())
        .then((res: PluginConfig) => {
          console.log("[Plugin] got plugins from server", res);
          const _func: any = (res.functions || []).map((f: any) => ({
            ...f,
            select: false,
          }));
          set(() => ({
            functions: _func,
          }));
        })
        .catch(() => {
          console.error("[Plugin] failed to fetch config");
        })
        .finally(() => {
          fetchState = 2;
        });
    },
  }),
  {
    name: StoreKey.Plugin,
    version: 1,
  },
);
