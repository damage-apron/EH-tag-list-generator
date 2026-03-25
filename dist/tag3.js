import he from "he";
/**
 * タグ内容を抽出する
 * @param contentMap ページIDとページ内容のペアのマップ (例: { "123": "page content1", "456": "page content2" })
 * @returns タグIDとタグ内容のペアのリストのJSON文字列、タグIDのリストのJSON文字列、タグIDのリストのJSON文字列のいずれか
 */
export function tag3(contentMap) {
    /** pageid: japanese */
    const successList = new Map();
    /** pageid */
    const skippedList = new Set();
    /** pageid */
    const failureList = new Set();
    if (Array.isArray(contentMap)) {
        if (!contentMap[0]) {
            return JSON.stringify([{}, [], []]);
        }
        contentMap = contentMap[0];
    }
    for (const pageid in contentMap) {
        if (!Object.hasOwn(contentMap, pageid)
            || !contentMap[pageid]) {
            continue;
        }
        const content = contentMap[pageid];
        const japanese = content.match(/(?<=\n\|Japanese=[^\S\n\r]*)[^\n\r]+?(?=\n|\r|$)|(?<=\n[^\S\n\r]*\*[^\S\n\r]*'''Japanese'''[^\S\n\r]*:[^\S\n\r]*)[^\n\r]+?(?=\n|\r|$)|(?<=\n[^\S\n\r]*\*[^\S\n\r]*'''Chinese\/Japanese'''[^\S\n\r]*:[^\S\n\r]*)[^\n\r]+?(?=\n|\r|$)|(?<=\n[^\S\n\r]*\*[^\S\n\r]*'''Japanese\/Chinese'''[^\S\n\r]*:[^\S\n\r]*)[^\n\r]+?(?=\n|\r|$)|(?<=\n[^\S\n\r]*\*[^\S\n\r]*'''Japanese[^\S\n\r]*Indication'''[^\S\n\r]*:[^\S\n\r]*\[)[^\n\r]+?(?=\])|(?<=\n\|native=[^\S\n\r]*)[^\n\r]+?(?=\n|\r|$)/ig);
        if (japanese) {
            let noBracket = japanese[0];
            if (japanese.length !== 1) {
                noBracket = japanese.find(e => !/^\[.*\]$/.test(e));
                if (noBracket
                    ? japanese.some(e => noBracket !== e.replaceAll(/\[|\]/g, ""))
                    : japanese.some(e => japanese[0] !== e)) {
                    skippedList.add(Number(pageid));
                    continue;
                }
            }
            noBracket ??= japanese[0];
            const trimmed = he.decode(noBracket).replaceAll(/\（|\）|　/g, (match) => (match === "（"
                ? "("
                : match === "）"
                    ? ")"
                    : " ")).trim();
            if (trimmed !== ""
                && !/''\s*or\s*''/i.test(trimmed)) {
                successList.set(Number(pageid), trimmed);
            }
            else {
                skippedList.add(Number(pageid));
            }
        }
        else {
            failureList.add(Number(pageid));
        }
    }
    return JSON.stringify([
        Object.fromEntries(successList),
        [...skippedList].sort((a, b) => a - b),
        [...failureList].sort((a, b) => a - b),
    ]);
}
/**
 * タグ内容を抽出する (作者名とサークル名を分ける)
 * artost, cirlce 等の誤字も考慮する
 * @param contentMap ページIDとページ内容のペアのマップ (例: { "123": "page content1", "456": "page content2" })
 * @returns タグIDとタグ内容のペアのリストのJSON文字列、タグIDとタグ内容のペアのリストのJSON文字列、タグIDのリストのJSON文字列、タグIDのリストのJSON文字列のいずれか
 */
export function tag3Creator(contentMap) {
    /** pageid: japanese */
    const artistList = new Map();
    const groupList = new Map();
    /** pageid */
    const skippedList = new Set();
    /** pageid */
    const failureList = new Set();
    if (Array.isArray(contentMap)) {
        if (!contentMap[0]) {
            return JSON.stringify([{}, {}, [], []]);
        }
        contentMap = contentMap[0];
    }
    for (const pageid in contentMap) {
        if (!Object.hasOwn(contentMap, pageid)
            || !contentMap[pageid]) {
            continue;
        }
        const content = contentMap[pageid];
        const japanese = content.match(/(?<=\n\|Japanese=[^\S\n\r]*)[^\n\r]+?(?=\n|\r|$)|(?<=\n[^\S\n\r]*\*[^\S\n\r]*'''Japanese'''[^\S\n\r]*:[^\S\n\r]*)[^\n\r]+?(?=\n|\r|$)|(?<=\n[^\S\n\r]*\*[^\S\n\r]*'''Chinese\/Japanese'''[^\S\n\r]*:[^\S\n\r]*)[^\n\r]+?(?=\n|\r|$)|(?<=\n[^\S\n\r]*\*[^\S\n\r]*'''Japanese\/Chinese'''[^\S\n\r]*:[^\S\n\r]*)[^\n\r]+?(?=\n|\r|$)|(?<=\n[^\S\n\r]*\*[^\S\n\r]*'''Japanese[^\S\n\r]*Indication'''[^\S\n\r]*:[^\S\n\r]*\[)[^\n\r]+?(?=\])|(?<=\n\|native=[^\S\n\r]*)[^\n\r]+?(?=\n|\r|$)/ig);
        if (japanese) {
            let noBracket = japanese[0];
            if (japanese.length !== 1) {
                noBracket = japanese.find(e => !/^\[.*\]$/.test(e));
                if (noBracket
                    ? japanese.some(e => noBracket !== e.replaceAll(/\[|\]/g, ""))
                    : japanese.some(e => japanese[0] !== e)) {
                    skippedList.add(Number(pageid));
                    continue;
                }
            }
            noBracket ??= japanese[0];
            const trimmed = he.decode(noBracket).replaceAll(/\（|\）|　/g, (match) => (match === "（"
                ? "("
                : match === "）"
                    ? ")"
                    : " ")).trim();
            if (trimmed !== ""
                && !/''\s*or\s*''/i.test(trimmed)) {
                const filteredContent = content.replaceAll(/\]\]\s*,\s*\[\[/g, "").replaceAll(/groups=\[\[[^\[\]]+\]\]/g, "").replaceAll(/\[\[Category:Creator Tag\]\]|\*\s?'''Related'''\s?:\s?\[\[(?:circle|cirlce)[^\[\]]+\]\]|''For\s?the[^\n\r':\[\]]+?see\s\[\[[^\[\]]+\]\]/g, "");
                const typeMatches = filteredContent.split(/'''Type''':\s?([^\n\r':\[\]]+)/gi);
                if (1 < typeMatches.length
                    && typeMatches.length <= 3
                    && !/'''Japanese''':\s?[^\n\r':\[\]]*?[,/][^\n\r':\[\]]*?(?:[\n\r':\[\]]|$)/gi.test(filteredContent)) {
                    let isSkipped = true;
                    if (/(?:Artist|Artost)|Cosplayer/i.test(typeMatches[1])) {
                        artistList.set(Number(pageid), trimmed);
                        isSkipped = false;
                    }
                    if (/(?:Circle|cirlce)|Game\s?Company|Website|Group/i.test(typeMatches[1])) {
                        groupList.set(Number(pageid), trimmed);
                        isSkipped = false;
                    }
                    if (isSkipped) {
                        skippedList.add(Number(pageid));
                    }
                }
                else if (/(?:Artist|Artost)|Cosplayer/i.test(filteredContent)
                    && !/(?:Circle|cirlce)|Game\s?Company|Website|'''Type''':\s?Group/i.test(filteredContent)) {
                    artistList.set(Number(pageid), trimmed);
                }
                else if (/(?:Circle|cirlce)|Game\s?Company|Website|'''Type''':\s?Group/i.test(filteredContent)
                    && !/(?:Artist|Artost)|Cosplayer/i.test(filteredContent)) {
                    groupList.set(Number(pageid), trimmed);
                }
                else {
                    skippedList.add(Number(pageid));
                }
            }
            else {
                skippedList.add(Number(pageid));
            }
        }
        else {
            failureList.add(Number(pageid));
        }
    }
    return JSON.stringify([
        Object.fromEntries(artistList),
        Object.fromEntries(groupList),
        [...skippedList].sort((a, b) => a - b),
        [...failureList].sort((a, b) => a - b),
    ]);
}
