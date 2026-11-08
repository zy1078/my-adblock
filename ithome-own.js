/*
 * IT之家信息流个人净化测试版
 * 参考：墨鱼 IT之家脚本中的广告标记判断。
 * 仅处理 data.list 是数组且 flag 为数字 2 的项目。
 * 不主动联网；数据格式不符合预期时保留原响应。
 */
(() => {
  const raw = typeof $response !== 'undefined' && $response
    ? $response.body
    : null;

  if (typeof raw !== 'string') {
    $done({});
    return;
  }

  try {
    const obj = JSON.parse(raw);

    if (!obj || !obj.data || !Array.isArray(obj.data.list)) {
      $done({});
      return;
    }

    obj.data.list = obj.data.list.filter(item => {
      return !(
        item &&
        item.feedContent &&
        item.feedContent.flag === 2
      );
    });

    $done({ body: JSON.stringify(obj) });
  } catch (_) {
    $done({});
  }
})();
