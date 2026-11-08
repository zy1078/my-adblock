/*
 * IT之家去广告测试脚本
 * 原始脚本作者：可莉
 * 此版本将两个选项写成固定值，方便在个人模块中测试。
 */

(() => {
    if (!$response?.body) return $done({});

    let modified = false;
    let body;

    try {
        body = JSON.parse($response.body);
    } catch (e) {
        console.log(`JSON解析失败: ${e.message}`);
        return $done({});
    }

    // true：移除整个轮播图
    // false：保留轮播图，只移除其中标记为广告的内容
    const removeAllBanners = true;

    // true：移除置顶文章
    // false：保留置顶文章
    const removePinnedArticles = false;

    // 移除全部轮播图
    const removeAllBannersFunc = () => {
        if (!removeAllBanners) return;

        if (Array.isArray(body?.data?.list)) {
            const originalLength = body.data.list.length;

            body.data.list = body.data.list.filter(item =>
                item.feedType !== 10002
            );

            modified ||= (originalLength !== body.data.list.length);
        }
    };

    // 移除置顶文章
    const removePinnedArticlesFunc = () => {
        if (!removePinnedArticles) return;

        if (Array.isArray(body?.data?.list)) {
            const originalLength = body.data.list.length;

            body.data.list = body.data.list.filter(item =>
                item.feedType !== 10003
            );

            modified ||= (originalLength !== body.data.list.length);
        }
    };

    // 移除轮播图中的广告
    const removeBannerAdsFunc = () => {
        if (!Array.isArray(body?.data?.list)) return;

        body.data.list.forEach(item => {
            if (
                item.feedContent?.focusNewsData &&
                Array.isArray(item.feedContent.focusNewsData)
            ) {
                const originalLength =
                    item.feedContent.focusNewsData.length;

                item.feedContent.focusNewsData =
                    item.feedContent.focusNewsData.filter(ad =>
                        !ad.isAd
                    );

                modified ||= (
                    originalLength !==
                    item.feedContent.focusNewsData.length
                );
            }
        });
    };

    // 移除信息流中带已知广告标记的项目
    const removeFeedAdsFunc = () => {
        if (!Array.isArray(body?.data?.list)) return;

        const originalLength = body.data.list.length;

        body.data.list = body.data.list.filter(item => {
            if (
                item.feedContent?.flag === 2 ||
                item.feedType === 10004
            ) {
                return false;
            }

            if (
                item.feedContent?.smallTags &&
                Array.isArray(item.feedContent.smallTags)
            ) {
                const hasAdTag =
                    item.feedContent.smallTags.some(tag =>
                        typeof tag.text === 'string' &&
                        tag.text === '广告'
                    );

                if (hasAdTag) return false;
            }

            return true;
        });

        modified ||= (originalLength !== body.data.list.length);
    };

    removeAllBannersFunc();
    removePinnedArticlesFunc();
    removeBannerAdsFunc();
    removeFeedAdsFunc();

    $done(modified ? {
        body: JSON.stringify(body),
    } : {});
})();
