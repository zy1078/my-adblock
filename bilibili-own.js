/*
哔哩哔哩个人净化 - 测试版

参考：
https://github.com/Thelongdarkorg/loon-plugins

处理开屏展示列表和首页带明确广告标记的卡片。
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

  // 如果响应中有超出 JS 安全范围的数字，原样放行，
  // 避免重新序列化时改变视频或其他内容的数字 ID。
  const pending = [body];

  while (pending.length > 0) {
    const value = pending.pop();

    if (
      typeof value === "number" &&
      (
        !Number.isFinite(value) ||
        (Number.isInteger(value) && !Number.isSafeInteger(value))
      )
    ) {
      return $done({});
    }

    if (value && typeof value === "object") {
      for (const child of Object.values(value)) {
        pending.push(child);
      }
    }
  }

  const url = $request.url || "";
  let modified = false;

  // 开屏：清空展示和事件列表
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

  // 首页：过滤带明确广告标记的卡片
  else if (
    /\/x\/v2\/feed\/index(?:\?|$)/.test(url) &&
    Array.isArray(body.data?.items)
  ) {
    const adTypes = [
      "ad_av",
      "ad_web_s",
      "ad_web_gif"
    ];

    const filtered = body.data.items.filter((item) => {
      if (!item || typeof item !== "object") return true;

      return (
        item.ad_info == null &&
        item.is_ad !== true &&
        item.is_ad !== 1 &&
        !adTypes.includes(item.card_goto) &&
        !adTypes.includes(item.card_type)
      );
    });

    if (filtered.length !== body.data.items.length) {
      body.data.items = filtered;
      modified = true;
    }
  }

  $done(modified ? { body: JSON.stringify(body) } : {});
})();
