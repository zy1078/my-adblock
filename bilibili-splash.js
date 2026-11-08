/*
B站开屏净化 - 测试版

参考：
https://github.com/Thelongdarkorg/loon-plugins
*/

(() => {
  if (typeof $response === "undefined" || !$response.body) {
    return $done({});
  }

  const url = $request.url || "";
  let body;

  try {
    body = JSON.parse($response.body);
  } catch (error) {
    return $done({});
  }

  // 只处理成功且包含 data 对象的响应
  if (
    !body ||
    body.code !== 0 ||
    !body.data ||
    typeof body.data !== "object" ||
    Array.isArray(body.data)
  ) {
    return $done({});
  }

  // 开屏素材列表：返回空的开屏配置
  if (/\/x\/v2\/splash\/list(?:\?|$)/.test(url)) {
    console.log("B站开屏诊断：list 已返回空配置");

    return $done({
      body: JSON.stringify({
        code: 0,
        message: "OK",
        ttl: 1,
        data: {
          max_time: 0,
          min_interval: 31536000,
          pull_interval: 31536000,
          keep_ids: [],
          show: [],
          list: [{}],
          splash_request_id: ""
        }
      })
    });
  }

  // 防止修改其他响应时改变超出安全范围的数字 ID
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

  let modified = false;

  for (const key of ["show", "event_list"]) {
    if (Array.isArray(body.data[key]) && body.data[key].length > 0) {
      body.data[key] = [];
      modified = true;
    }
  }

  console.log(
    "B站开屏诊断：展示或事件列表" +
    (modified ? "已清空" : "未发现可清空内容")
  );

  $done(modified ? { body: JSON.stringify(body) } : {});
})();
