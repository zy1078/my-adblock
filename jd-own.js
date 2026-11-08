/*
京东个人净化 - 测试版

参考 RuCu6、Maasea 的京东净化脚本：
https://github.com/RuCu6

仅尝试处理：
1. 开屏图片
2. 首页部分悬浮推广
3. 物流页指定推广横幅
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

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return $done({});
  }

  const match = ($request.url || "").match(/[?&]functionId=([^&#]*)/);
  const functionId = match ? match[1] : "";

  let modified = false;

  // 开屏广告
  if (functionId === "start") {
    if (Array.isArray(body.images) && body.images.length > 0) {
      body.images = [];
      modified = true;
    }

    if (
      typeof body.showTimesDaily === "number" &&
      body.showTimesDaily !== 0
    ) {
      body.showTimesDaily = 0;
      modified = true;
    }
  }

  // 首页：只移除原脚本中标注的部分推广浮层
  if (functionId === "welcomeHome" && Array.isArray(body.floorList)) {
    const adTypes = [
      "bottomXview",
      "float",
      "photoCeiling"
    ];

    const filtered = body.floorList.filter((item) => {
      return !adTypes.includes(item?.type);
    });

    if (filtered.length !== body.floorList.length) {
      body.floorList = filtered;
      modified = true;
    }
  }

  // 物流页：只移除指定的推广横幅
  if (
    (functionId === "deliverLayer" ||
      functionId === "orderTrackBusiness") &&
    Array.isArray(body.floors)
  ) {
    const filtered = body.floors.filter((item) => {
      return item?.mId !== "jdDeliveryBanner";
    });

    if (filtered.length !== body.floors.length) {
      body.floors = filtered;
      modified = true;
    }
  }

  $done(modified ? { body: JSON.stringify(body) } : {});
})();
