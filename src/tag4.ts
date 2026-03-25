import type { JsonContent } from "./types/json-content.js";

/**
 * タグIDとタグ名のペアのマップをタグIDと翻訳されたタグ名のペアのマップに変換する  
 * @param idTitleMap タグIDとタグ名のペアのマップ (例: { "123": "tag1", "456": "tag2" })
 * @param idTranslateMap タグIDと翻訳されたタグ名のペアのマップ (例: { "123": "タグ1", "456": "タグ2" })
 * @returns タグIDと翻訳されたタグ名のペアのマップのJSON文字列、タグIDのリストのJSON文字列のいずれか
 */
export function tag4(
  idTitleMap: JsonContent,
  idTranslateMap: JsonContent,
): string {
  if (Array.isArray(idTitleMap)) {
    if (!idTitleMap[0]) { return JSON.stringify([{}, []]); }
    idTitleMap = idTitleMap[0];
  }
  if (Array.isArray(idTranslateMap)) {
    if (!idTranslateMap[0]) { return JSON.stringify([{}, []]); }
    idTranslateMap = idTranslateMap[0];
  }

  const translateMap: Map<string, string> = new Map();
  const failureList: Set<number> = new Set();
  for (const pageid in idTranslateMap) {
    if (!Object.hasOwn(idTranslateMap, pageid)) { continue; }
    if (
      idTitleMap[pageid]
      && idTranslateMap[pageid]
    ) {
      translateMap.set(idTitleMap[pageid], idTranslateMap[pageid]);
    } else {
      failureList.add(Number(pageid));
    }
  }

  const result = Object.fromEntries([...translateMap.entries()].sort(([a], [b]) => a.localeCompare(b)));

  if (0 < failureList.size) {
    return JSON.stringify([
      result,
      [...failureList].sort((a, b) => a - b),
    ]);
  } else {
    return JSON.stringify(result);
  }
}
