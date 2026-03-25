import type { JsonContent } from "./types/json-content.js";
/**
 * タグIDとタグ名のペアのマップをタグIDと翻訳されたタグ名のペアのマップに変換する
 * @param idTitleMap タグIDとタグ名のペアのマップ (例: { "123": "tag1", "456": "tag2" })
 * @param idTranslateMap タグIDと翻訳されたタグ名のペアのマップ (例: { "123": "タグ1", "456": "タグ2" })
 * @returns タグIDと翻訳されたタグ名のペアのマップのJSON文字列、タグIDのリストのJSON文字列のいずれか
 */
export declare function tag4(idTitleMap: JsonContent, idTranslateMap: JsonContent): string;
