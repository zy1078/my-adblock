/*
小红书个人净化 - 测试版

参考用户提供的 RuCu6 小红书脚本：
https://github.com/RuCu6/Loon

仅尝试处理开屏配置和首页信息流广告。
*/

(() => {
  if (!$response || !$response.body) {
    return $done({});
  }

  let body;

  try {
    body = JSON.parse($response.body);
  } catch (error) {
    console.log("小红书净化：响应不是有效的 JSON");
    return $done({});
  }

  const url = $request.url;
  let modified = false;

  // 开屏及部分启动配置
  if (url.includes("/api/sns/v1/system_service/config")) {
    if (body?.data && Object.prototype.hasOwnProperty.call(body.data, "splash")) {
      delete body.data.splash;
      modified = true;
    }
  }

  // 将开屏广告的展示时间改到未来
  if (url.includes("/api/sns/v2/system_service/splash_config")) {
    const groups = body?.data?.ads_groups;

    if (Array.isArray(groups)) {
      for (const group of groups) {
        if (!group || typeof group !== "object") continue;

        group.start_time = 3818332800;
        group.end_time = 3818419199;
        modified = true;

        if (Array.isArray(group.ads)) {
          for (const ad of group.ads) {
            if (!ad || typeof ad !== "object") continue;

            ad.start_time = 3818332800;
            ad.end_time = 3818419199;
          }
        }
      }
    }
  }

  // 首页信息流：过滤带 ads_info 字段的条目
  if (url.includes("/api/sns/v6/homefeed")) {
    if (Array.isArray(body?.data)) {
      const originalLength = body.data.length;

      body.data = body.data.filter((item) => {
        if (!item || typeof item !== "object") return true;
        return !Object.prototype.hasOwnProperty.call(item, "ads_info");
      });

      if (body.data.length !== originalLength) {
        modified = true;
      }
    }
  }

  $done(modified ? { body: JSON.stringify(body) } : {});
})();
