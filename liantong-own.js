/*
中国联通个人净化 - 测试版

首页浮窗规则参考：
https://github.com/Thelongdarkorg/loon-plugins

我的钱包规则参考墨鱼：
https://github.com/ddgksf2013/Rewrite
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

  if (!body || typeof body !== "object") {
    return $done({});
  }

  const url = $request.url;
  let modified = false;

  // 首页：删除浮窗推广字段
  if (url.includes("/clientIndex/homefusion/fuInter")) {
    const popupKey = "HomeFusion.fuchuangAdv_A8";

    if (Object.prototype.hasOwnProperty.call(body, popupKey)) {
      delete body[popupKey];
      modified = true;
    }
  }

  // 我的页面：清空钱包接口数据，尝试隐藏借钱入口
  if (/\/clientMyPage\/v\d\/api\/myWallet/.test(url)) {
    if (Object.prototype.hasOwnProperty.call(body, "data")) {
      body.data = {};
      modified = true;
    }
  }

  $done(modified ? { body: JSON.stringify(body) } : {});
})();
