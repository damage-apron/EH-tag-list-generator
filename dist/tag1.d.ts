/** ehwiki のタグIDリストを取得するクラス */
export declare class Tag1 {
    /** 取得間隔 (ミリ秒) */
    interval: number;
    /**
     * @param options.interval 取得間隔 (ミリ秒)
     */
    constructor({ interval, }?: {
        interval?: number | undefined;
    });
    /**
     * タグIDリストを取得する
     * @param cmtitleList カテゴリタイトルのリスト (例: "Category:Tag")
     * @returns タグIDリストのJSON文字列のリスト
     */
    generate(cmtitleList?: string[]): AsyncGenerator<string>;
}
