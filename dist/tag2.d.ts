import type { JsonContent } from "./types/json-content.js";
/** ehwiki のタグ内容を取得するクラス */
export declare class Tag2 {
    /** 取得間隔 (ミリ秒) */
    interval: number;
    /**
     * @param options.interval 取得間隔 (ミリ秒)
     */
    constructor({ interval, }?: {
        interval?: number | undefined;
    });
    /**
     * タグの内容を取得する
     * @param tagMapList タグIDとタグ名のペアのリストのリスト (例: [{ "123": "tag1", "456": "tag2" }])
     * @returns タグ内容のJSON文字列のリスト
     */
    generate(tagMapList: AsyncGenerator<JsonContent>): AsyncGenerator<string>;
}
