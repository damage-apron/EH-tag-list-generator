import type { JsonContent } from "./types/json-content.js";
/**
 * タグ内容を抽出する
 * @param contentMap ページIDとページ内容のペアのマップ (例: { "123": "page content1", "456": "page content2" })
 * @returns タグIDとタグ内容のペアのリストのJSON文字列、タグIDのリストのJSON文字列、タグIDのリストのJSON文字列のいずれか
 */
export declare function tag3(contentMap: JsonContent): string;
/**
 * タグ内容を抽出する (作者名とサークル名を分ける)
 * artost, cirlce 等の誤字も考慮する
 * @param contentMap ページIDとページ内容のペアのマップ (例: { "123": "page content1", "456": "page content2" })
 * @returns タグIDとタグ内容のペアのリストのJSON文字列、タグIDとタグ内容のペアのリストのJSON文字列、タグIDのリストのJSON文字列、タグIDのリストのJSON文字列のいずれか
 */
export declare function tag3Creator(contentMap: JsonContent): string;
