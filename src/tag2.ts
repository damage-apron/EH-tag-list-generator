import type { JsonContent } from "./types/json-content.js";

/** ehwiki のタグ内容を取得するクラス */
export class Tag2 {
  /** 取得間隔 (ミリ秒) */
  interval: number;

  /**
   * @param options.interval 取得間隔 (ミリ秒)
   */
  constructor({
    interval = 50,
  } = {}) {
    this.interval = interval;
  }

  /**
   * タグの内容を取得する  
   * @param tagMapList タグIDとタグ名のペアのリストのリスト (例: [{ "123": "tag1", "456": "tag2" }])
   * @returns タグ内容のJSON文字列のリスト
   */
  async *generate(tagMapList: AsyncGenerator<JsonContent>): AsyncGenerator<string> {
    let timeoutId: NodeJS.Timeout | null = null;
    let wait: Promise<void> = Promise.resolve();

    for await (let tagMap of tagMapList) {
      if (Array.isArray(tagMap)) {
        if (!tagMap[0]) {
          yield JSON.stringify({});
          continue;
        }
        tagMap = tagMap[0];
      }

      const apiUrlBase = "https://ehwiki.org/api.php?action=query&format=json&formatversion=2&prop=revisions&rvprop=content&rvslots=main&origin=*";
      const tagSet: Set<number> = new Set(Object.keys(tagMap).map(e => Number(e)));
      const tagList: number[] = [...tagSet];
      const successList: Map<number, string> = new Map();
      const failureList: Set<number> = new Set();
      for (let i = 0; i < tagList.length; i += 50) {
        const idList = tagList.slice(i, i + 50);
        const apiUrl = new URL(apiUrlBase);
        apiUrl.searchParams.set("pageids", idList.join("|"));
        await wait;
        wait = new Promise<void>(resolve => timeoutId = setTimeout(resolve, this.interval));
        console.log(`Fetching ${apiUrl.href}`);
        const response = await fetch(apiUrl.href);
        const data = await response.json() as any;
        for (const page of data.query?.pages ?? []) {
          if (!page.pageid) { continue; }
          page.pageid = Number(page.pageid);
          const content = page.revisions?.[0]?.slots?.main?.content;
          if (content) {
            successList.set(page.pageid, content);
          } else {
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
      } else {
        yield JSON.stringify(Object.fromEntries(successList));
      }
    }

    if (timeoutId) { clearTimeout(timeoutId); }
  }
}
