/** ehwiki のタグ内容を取得するクラス */
export class Tag2 {
    /** 取得間隔 (ミリ秒) */
    interval;
    /**
     * @param options.interval 取得間隔 (ミリ秒)
     */
    constructor({ interval = 50, } = {}) {
        this.interval = interval;
    }
    /**
     * タグの内容を取得する
     * @param tagMapList タグIDとタグ名のペアのリストのリスト (例: [{ "123": "tag1", "456": "tag2" }])
     * @returns タグ内容のJSON文字列のリスト
     */
    async *generate(tagMapList) {
        let timeoutId = null;
        let wait = Promise.resolve();
        for await (let tagMap of tagMapList) {
            if (Array.isArray(tagMap)) {
                if (!tagMap[0]) {
                    yield JSON.stringify({});
                    continue;
                }
                tagMap = tagMap[0];
            }
            const apiUrlBase = "https://ehwiki.org/api.php?action=query&format=json&formatversion=2&prop=revisions&rvprop=content&rvslots=main&origin=*";
            const tagSet = new Set(Object.keys(tagMap).map(e => Number(e)));
            const tagList = [...tagSet];
            const successList = new Map();
            const failureList = new Set();
            for (let i = 0; i < tagList.length; i += 50) {
                const idList = tagList.slice(i, i + 50);
                const apiUrl = new URL(apiUrlBase);
                apiUrl.searchParams.set("pageids", idList.join("|"));
                await wait;
                wait = new Promise(resolve => timeoutId = setTimeout(resolve, this.interval));
                console.log(`Fetching ${apiUrl.href}`);
                const response = await fetch(apiUrl.href);
                const data = await response.json();
                for (const page of data.query?.pages ?? []) {
                    if (!page.pageid) {
                        continue;
                    }
                    page.pageid = Number(page.pageid);
                    const content = page.revisions?.[0]?.slots?.main?.content;
                    if (content) {
                        successList.set(page.pageid, content);
                    }
                    else {
                        failureList.add(page.pageid);
                    }
                    tagSet.delete(page.pageid);
                }
            }
            for (const skippedId of tagSet) {
                failureList.add(Number(skippedId));
            }
            if (0 < failureList.size) {
                yield JSON.stringify([
                    Object.fromEntries(successList),
                    [...failureList].sort((a, b) => a - b),
                ]);
            }
            else {
                yield JSON.stringify(Object.fromEntries(successList));
            }
        }
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }
}
