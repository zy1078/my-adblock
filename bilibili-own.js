/*
哔哩哔哩个人净化 - 测试版

开屏规则参考用户提供的模块。
首页信息流规则参考：
https://github.com/Thelongdarkorg/loon-plugins
*/

(() => {
  if (typeof $response === "undefined" || !$response.body) {
    return $done({});
  }

  let body;

  try {
    body = JSON.parse($response.body);
  } catch (error) {
    return $done({});
  }

  if (!body || typeof body !== "object") {
    return $done({});
  }

  const url = $request.url || "";
  let modified = false;

  // 开屏：清空广告展示和事件列表
  if (/\/x\/v2\/splash\/(list|show|event\/list2)(?:\?|$)/.test(url)) {
    if (
      body.data &&
      typeof body.data === "object" &&
      !Array.isArray(body.data)
    ) {
      for (const key of ["show", "event_list"]) {
        if (Array.isArray(body.data[key]) && body.data[key].length > 0) {
          body.data[key] = [];
          modified = true;
        }
      }
    }
  }

  // 首页：过滤带有 ad_info 的推荐卡片
  else if (/\/x\/v2\/feed\/index(?:\?|$)/.test(url)) {
    if (Array.isArray(body.data?.items)) {
      const filtered = body.data.items.filter((item) => {
        if (!item || typeof item !== "object") return true;
        return item.ad_info == null;
      });

      if (filtered.length !== body.data.items.length) {
        body.data.items = filtered;
        modified = true;
      }
    }
  }

  $done(modified ? { body: JSON.stringify(body) } : {});
})();
