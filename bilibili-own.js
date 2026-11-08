/*
哔哩哔哩首页净化 - 测试版

参考：
https://github.com/Thelongdarkorg/loon-plugins

仅尝试过滤带有 ad_info 的首页推荐卡片。
*/

(() => {
  if (!$response || !$response.body) {
    return $done({});
  }

  let body;

  try {
    body = JSON.parse($response.body);
  } catch (error) {
    return $done({});
  }

  const items = body?.data?.items;

  if (!Array.isArray(items)) {
    return $done({});
  }

  const filtered = items.filter((item) => {
    if (!item || typeof item !== "object") return true;
    return item.ad_info == null;
  });

  if (filtered.length === items.length) {
    return $done({});
  }

  body.data.items = filtered;

  $done({
    body: JSON.stringify(body)
  });
})();
