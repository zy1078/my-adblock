/*
闲鱼首页信息流净化 - 测试版

参考用户提供的闲鱼去广告脚本：
https://github.com/fmz200/wool_scripts

仅过滤 bizType 明确为 AD 的信息流卡片。
*/

(() => {
  if (!$response || !$response.body) {
    return $done({});
  }

  let body;

  try {
    body = JSON.parse($response.body);
  } catch (error) {
    console.log("闲鱼净化：响应不是有效的 JSON");
    return $done({});
  }

  const sections = body?.data?.sections;

  if (!Array.isArray(sections)) {
    return $done({});
  }

  const filtered = sections.filter((section) => {
    return section?.data?.bizType !== "AD";
  });

  if (filtered.length === sections.length) {
    return $done({});
  }

  body.data.sections = filtered;

  $done({
    body: JSON.stringify(body)
  });
})();
