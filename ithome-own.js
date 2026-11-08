/*
 * IT之家个人净化测试版
 * 过滤条件参考可莉的 IT之家去广告脚本。
 * 不主动联网；遇到不认识的数据格式时保留原响应。
 */
(() => {
  const raw = typeof $response !== 'undefined' && $response
    ? $response.body
    : null;

  if (typeof raw !== 'string') return $done({});

  try {
    const result = JSON.parse(raw);

    if (!result || !result.data || !Array.isArray(result.data.list)) {
      return $done({});
    }

    // true：隐藏整个顶部轮播图；false：保留轮播图中的正常内容。
    const removeAllBanners = true;

    // true：隐藏置顶文章；false：保留置顶文章。
    const removePinnedArticles = false;

    result.data.list = result.data.list.filter(item => {
      if (!item || typeof item !== 'object') return true;

      const content = item.feedContent;

      // 过滤已知的信息流广告标记。
      if (content && content.flag === 2) return false;
      if (item.feedType === 10004) return false;

      // 过滤带“广告”标签的项目。
      if (
        content &&
        Array.isArray(content.smallTags) &&
        content.smallTags.some(tag => tag && tag.text === '广告')
      ) {
        return false;
      }

      if (removeAllBanners && item.feedType === 10002) return false;
      if (removePinnedArticles && item.feedType === 10003) return false;

      return true;
    });

    // 如果保留轮播图，只移除其中带广告标记的内容。
    for (const item of result.data.list) {
      const content = item && item.feedContent;

      if (content && Array.isArray(content.focusNewsData)) {
        content.focusNewsData = content.focusNewsData.filter(
          entry => !entry || !entry.isAd
        );
      }
    }

    return $done({ body: JSON.stringify(result) });
  } catch (_) {
    return $done({});
  }
})();
