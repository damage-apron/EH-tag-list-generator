/** ehwiki のタグIDリストを取得するクラス */
export class Tag1 {
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
   * タグIDリストを取得する  
   * @param cmtitleList カテゴリタイトルのリスト (例: "Category:Tag")
   * @returns タグIDリストのJSON文字列のリスト
   */
  async *generate(cmtitleList = [
    "Category:Tag",
    "Category:Series_Tag",
    "Category:Creator_Tag",
    "Category:Character_Tag",
  ]): AsyncGenerator<string> {
    let timeoutId: NodeJS.Timeout | null = null;
    let wait: Promise<void> = Promise.resolve();

    for (const cmtitle of cmtitleList) {
      const apiUrlBase = `https://ehwiki.org/api.php?action=query&format=json&formatversion=2&list=categorymembers&cmlimit=max&cmtitle=${encodeURIComponent(cmtitle)}`;
      const tagIdList = new Map();
      const otherList = new Map();
      for (let u: string | null = apiUrlBase; u;) {
        await wait;
        wait = new Promise<void>(resolve => timeoutId = setTimeout(resolve, this.interval));
        console.log(`Fetching ${u}`);
        const response = await fetch(u);
        const data = await response.json() as any;
        if (data.continue?.cmcontinue) {
          const apiUrl = new URL(apiUrlBase);
          apiUrl.searchParams.set("cmcontinue", data.continue.cmcontinue);
          u = apiUrl.href;
        } else {
          u = null;
        }
        for (const e of data.query.categorymembers) {
          // ns(namespace) が 0 だとコンテンツページ
          if (e.ns === 0) {
            tagIdList.set(e.pageid, e.title);
          } else {
            otherList.set(e.pageid, e.title);
          }
        }
      }

      if (0 < otherList.size) {
        yield JSON.stringify([
          Object.fromEntries(tagIdList),
          Object.fromEntries(otherList),
        ]);
      } else {
        yield JSON.stringify(Object.fromEntries(tagIdList));
      }
    }

    if (timeoutId) { clearTimeout(timeoutId); }
  }
}
