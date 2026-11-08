/*
 * 酷安个人净化脚本 v1.0
 * 用途：在本机处理指定的酷安 API 响应；无账号读取、存储或网络上传代码。
 * 根据已观察的接口字段独立编写；接口升级后可能需要调整。
 * 如果响应结构不符合预期或发生异常，返回原始响应，避免影响正常使用。
 */
(() => {
  const body = typeof $response !== 'undefined' && $response ? $response.body : null;
  const url = typeof $request !== 'undefined' && $request ? String($request.url || '') : '';
  if (typeof body !== 'string') { $done({}); return; }
  try {
    const result = JSON.parse(body);
    if (!result || typeof result !== 'object') { $done({}); return; }
    const path = url.split('?')[0];
    const isList = Array.isArray(result.data);
    const startupIds = new Set([945, 6390, 24455, 36839]);
    const homeIds = new Set([8639, 29349, 33006, 32557]);
    const promoted = item => item && typeof item === 'object' && item.entityTemplate === 'sponsorCard';
    if (isList && path.endsWith('/v6/main/init')) {
      result.data = result.data.filter(item => !startupIds.has(Number(item && item.entityId)));
    } else if (isList && path.endsWith('/v6/main/indexV8')) {
      result.data = result.data.filter(item => {
        if (!item || typeof item !== 'object') return true;
        const title = typeof item.title === 'string' ? item.title : '';
        return !promoted(item) && !homeIds.has(Number(item.entityId)) && !title.includes('值得买') && !title.includes('红包');
      });
    } else if (isList && (path.endsWith('/v6/dataList') || path.endsWith('/v6/page/dataList'))) {
      const unwanted = new Set(['sponsorCard', 'iconButtonGridCard', 'iconLargeScrollCard']);
      result.data = result.data.filter(item => {
        if (!item || typeof item !== 'object') return true;
        const title = typeof item.title === 'string' ? item.title : '';
        return !unwanted.has(item.entityTemplate) && !/流量|精选配件/.test(title);
      });
    } else if (isList && path.endsWith('/v6/feed/replyList')) {
      result.data = result.data.filter(item => item && item.id);
    } else if (path.endsWith('/v6/feed/detail') && result.data && typeof result.data === 'object') {
      for (const name of ['hotReplyRows', 'topReplyRows']) {
        if (Array.isArray(result.data[name])) result.data[name] = result.data[name].filter(item => item && item.id);
      }
      for (const name of ['include_goods', 'include_goods_ids', 'detailSponsorCard']) {
        if (Object.prototype.hasOwnProperty.call(result.data, name)) result.data[name] = [];
      }
    } else { $done({}); return; }
    $done({ body: JSON.stringify(result) });
  } catch (_) { $done({}); }
})();
