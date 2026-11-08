/*
哔哩哔哩个人净化 - 临时诊断版

日志只记录处理状态和数量，不记录商品、视频或账号内容。
*/

(() => {
  if (typeof $response === "undefined" || !$response.body) {
    console.log("B站诊断：没有响应内容");
    return $done({});
  }

  let body;

  try {
    body = JSON.parse($response.body);
  } catch (error) {
    console.log("B站诊断：响应不是有效的 JSON");
    return $done({});
  }

  if (!body || typeof body !== "object") {
    console.log("B站诊断：响应格式不符合预期");
    return $done({});
  }

  // 大数字保护：发现不安全数字时原样放行
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
      console.log("B站诊断：触发大数字保护，响应未修改");
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

  // 开屏处理
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

  // 首页推荐流处理
  else if (/\/x\/v2\/feed\/index(?:\?|$)/.test(url)) {
    const items = body.data?.items;

    if (!Array.isArray(items)) {
      console.log("B站诊断：首页响应没有找到 items 数组");
      return $done({});
    }

    const adTypes = ["ad_av", "ad_web_s", "ad_web_gif"];

    const filtered = items.filter((item) => {
      if (!item || typeof item !== "object") return true;

      return (
        item.ad_info == null &&
        item.is_ad !== true &&
        item.is_ad !== 1 &&
        !adTypes.includes(item.card_goto) &&
        !adTypes.includes(item.card_type)
      );
    });

    const removed = items.length - filtered.length;

    console.log(
      "B站诊断：首页卡片 " + items.length +
      " 条，匹配广告标记 " + removed + " 条"
    );

    if (removed > 0) {
      body.data.items = filtered;
      modified = true;
    }
  }

  $done(modified ? { body: JSON.stringify(body) } : {});
})();
