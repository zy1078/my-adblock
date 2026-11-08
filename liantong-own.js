/*
中国联通首页浮窗净化 - 测试版

参考：
https://github.com/Thelongdarkorg/loon-plugins
*/

(() => {
  if (!$response || !$response.body) {
    return $done({});
  }

  let body;

  try {
    body = JSON.parse($response.body);
  } catch (error) {
    console.log("联通净化：响应不是有效的 JSON");
    return $done({});
  }

  const popupKey = "HomeFusion.fuchuangAdv_A8";

  if (
    body &&
    typeof body === "object" &&
    Object.prototype.hasOwnProperty.call(body, popupKey)
  ) {
    delete body[popupKey];
    return $done({ body: JSON.stringify(body) });
  }

  $done({});
})();
