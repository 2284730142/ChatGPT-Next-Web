import { useState, useEffect, useMemo } from "react";

import styles from "./plugin.module.scss";

import { ErrorBoundary } from "@/app/components/error";
import { IconButton } from "@/app/components/button";
import CloseIcon from "@/app/icons/close.svg";
import { Path } from "@/app/constant";
import { useNavigate } from "react-router-dom";
import { usePluginStore } from "@/app/store/plugin";

export function Plugin() {
  const navigate = useNavigate();
  const pluginsStore = usePluginStore();

  const { functions = [] } = pluginsStore || {};
  const [searchFunctions, setSearchFunctions] = useState<any[]>();
  const [searchText, setSearchText] = useState("");
  const plugins: any[] =
    (searchText.length > 0 ? searchFunctions : functions) || [];

  const onSearch = (text: string) => {
    setSearchText(text);
    if (text.length > 0) {
      const result = functions.filter((m: any) => m.name_cn.includes(text));
      setSearchFunctions(result);
    } else {
      setSearchFunctions(functions);
    }
  };

  const updateSelect = ({ key, select }: { key: string; select: boolean }) => {
    // TODO 检查是否已经选择超过一定数量
    // 更新当前选择
    let _data = plugins.map((p) => ({
      ...p,
      ...(key === p.key ? { select: select } : {}),
    }));
    pluginsStore.updatePlugins(_data);
  };

  useEffect(() => {
    console.log("functions", functions);
  }, [functions]);

  return (
    <ErrorBoundary>
      <div className="window-header" data-tauri-drag-region>
        <div className="window-header-title">
          <div className="window-header-main-title">插件</div>
          <div className="window-header-sub-title">所有的插件配置</div>
        </div>
        <div className="window-actions">
          <div className="window-action-button"></div>
          <div className="window-action-button"></div>
          <div className="window-action-button">
            <IconButton
              icon={<CloseIcon />}
              onClick={() => navigate(Path.Home)}
              bordered
            />
          </div>
        </div>
      </div>
      <div className={styles["plugin"]}>
        <div className={styles["plugin-filter"]}>
          <input
            type="text"
            className={styles["plugin-bar"]}
            placeholder={"搜索插件"}
            autoFocus
            onInput={(e) => onSearch(e.currentTarget.value)}
          />
        </div>
        <div>
          {plugins.map((func: any) => {
            const { key, icon, name_cn, description_cn, select } = func;
            return (
              <div className={styles["plugin-item"]} key={key}>
                <div className={styles["plugin-header"]}>
                  <div className={styles["plugin-title"]}>
                    <div className={styles["plugin-name"]}>{name_cn}</div>
                    <div className={styles["plugin-info"] + " one-line"}>
                      {description_cn}
                    </div>
                  </div>
                </div>
                <div className={styles["plugin-actions"]}>
                  <input
                    type="checkbox"
                    checked={select}
                    onChange={(e) => updateSelect({ key, select: !select })}
                  ></input>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ErrorBoundary>
  );
}
