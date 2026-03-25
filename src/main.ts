import path from "path";
import fs from "fs/promises";

import JSONC from "jsonc-parser";

import type {
  JsonMap,
  JsonContent,
} from "./types/json-content.js";

/** 出力先のディレクトリ */
const outputDir = path.resolve("data");
await fs.mkdir(outputDir, { recursive: true });
/** パスとタイトルのペアのリスト */
const pathAndTitleList: [string, string][] = [
  ["tag", "Category:Tag"],
  ["seriesTag", "Category:Series_Tag"],
  ["creatorTag", "Category:Creator_Tag"],
  ["characterTag", "Category:Character_Tag"],
];
/** `Category:Character_Tag` の分離先 */
const creatorTagPathSeparate = ["artistTag", "circleTag"];
/** 最終出力先 */
const finalOutputPath = path.resolve(outputDir, "jsonc", "data1.jsonc");
await fs.mkdir(path.dirname(finalOutputPath), { recursive: true });

//#region Tag1
import { Tag1 } from "./tag1.js";
console.log("start Tag1");
{
  const pathList: string[] = [];
  const titleList: string[] = [];

  for (const [p, t] of pathAndTitleList) {
    const targetPath = path.join(outputDir, `${p}_1.json`);
    try {
      await fs.access(targetPath);
      console.log(`${`${p}_1.json`} already exists. ${t} will be skipped.`);
      continue;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }
    pathList.push(targetPath);
    titleList.push(t);
  }

  const tag1 = new Tag1({
    interval: 50,
  });

  let pathIndex = 0;
  for await (const json of tag1.generate(titleList)) {
    const targetPath = pathList[pathIndex++]!;
    await fs.writeFile(targetPath, json);
    console.log(`Saving ${targetPath}`);
  }
}
console.log("  end Tag1");
//#endregion

//#region Tag2
import { Tag2 } from "./tag2.js";
console.log("start Tag2");
{
  const outputList: string[] = [];
  const inputList: string[] = [];
  for (const [p] of pathAndTitleList) {
    const targetPath = path.join(outputDir, `${p}_2.json`);
    try {
      await fs.access(targetPath);
      console.log(`${`${p}_2.json`} already exists and will be skipped.`);
      continue;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }
    outputList.push(targetPath);
    inputList.push(path.join(outputDir, `${p}_1.json`));
  }

  const tag2 = new Tag2({
    interval: 50,
  });

  async function* readJsonFileGenerator(filePathList: string[]): AsyncGenerator<JsonContent> {
    for (const filePath of filePathList) {
      const content = await fs.readFile(filePath, "utf-8");
      yield JSON.parse(content) as JsonContent;
    }
  }

  let outputIndex = 0;
  for await (const json of tag2.generate(readJsonFileGenerator(inputList))) {
    const targetPath = outputList[outputIndex++]!;
    await fs.writeFile(targetPath, json);
    console.log(`Saving ${targetPath}`);
  }
}
console.log("  end Tag2");
//#endregion

//#region Tag3
import {
  tag3,
  tag3Creator,
} from "./tag3.js";
console.log("start Tag3");
{
  for (const [p, t] of pathAndTitleList) {
    const targetOutputPath = path.join(outputDir, `${p}_3.json`);
    try {
      await fs.access(targetOutputPath);
      console.log(`${`${p}_3.json`} already exists and will be skipped.`);
      continue;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }
    const targetInputPath = path.join(outputDir, `${p}_2.json`);
    const data = await fs.readFile(targetInputPath, "utf-8");
    const contentMap = JSON.parse(data) as JsonContent;
    if (t !== "Category:Creator_Tag") {
      const json = tag3(contentMap);
      await fs.writeFile(targetOutputPath, json);
    } else {
      const json = tag3Creator(contentMap);
      await fs.writeFile(targetOutputPath, json);
    }
    console.log(`Saving ${targetOutputPath}`);
  }
}
console.log("  end Tag3");
//#endregion

//#region Tag4
import { tag4 } from "./tag4.js";
console.log("start Tag4");
{
  for (const [p, t] of pathAndTitleList) {
    if (t !== "Category:Creator_Tag") {
      const targetOutputPath = path.join(outputDir, `${p}_4.json`);
      try {
        await fs.access(targetOutputPath);
        console.log(`${`${p}_4.json`} already exists and will be skipped.`);
        continue;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
          throw error;
        }
      }
      const idTitleInputPath = path.join(outputDir, `${p}_1.json`);
      const idTitleData = await fs.readFile(idTitleInputPath, "utf-8");
      const idTitleMap = JSON.parse(idTitleData) as JsonContent;
      const idTranslateInputPath = path.join(outputDir, `${p}_3.json`);
      const idTranslateData = await fs.readFile(idTranslateInputPath, "utf-8");
      const idTranslateMap = JSON.parse(idTranslateData) as JsonContent;
      const json = tag4(idTitleMap, idTranslateMap);
      await fs.writeFile(targetOutputPath, json);
      console.log(`Saving ${targetOutputPath}`);
    } else {
      let idTitleInputPath;
      let idTitleData;
      let idTitleMap;
      let idTranslateInputPath;
      let idTranslateData;
      let idTranslateMap;
      for (let i = 0; i < creatorTagPathSeparate.length; i++) {
        const separate = creatorTagPathSeparate[i];
        const targetOutputPath = path.join(outputDir, `${separate}_4.json`);
        try {
          await fs.access(targetOutputPath);
          console.log(`${`${p}_4.json`} already exists and will be skipped.`);
          continue;
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
            throw error;
          }
        }
        idTitleInputPath ??= path.join(outputDir, `${p}_1.json`);
        idTitleData ??= await fs.readFile(idTitleInputPath, "utf-8");
        idTitleMap ??= JSON.parse(idTitleData) as JsonContent;
        idTranslateInputPath ??= path.join(outputDir, `${p}_3.json`);
        idTranslateData ??= await fs.readFile(idTranslateInputPath, "utf-8");
        idTranslateMap ??= JSON.parse(idTranslateData) as JsonContent;
        if (!Array.isArray(idTranslateMap)) { continue; }
        const json = tag4(idTitleMap, idTranslateMap[i]!);
        await fs.writeFile(targetOutputPath, json);
        console.log(`Saving ${targetOutputPath}`);
      }
    }
  }
}
console.log("  end Tag4");
//#endregion

//#region final output
console.log("start final output");
{
  const finalData: Record<string, JsonMap> = {};
  const finalNameList: string[] = [];
  const finalPathList: string[] = [];
  for (const [p, t] of pathAndTitleList) {
    if (t !== "Category:Creator_Tag") {
      const targetPath = path.join(outputDir, `${p}_4.json`);
      try {
        await fs.access(targetPath);
        finalNameList.push(p);
        finalPathList.push(targetPath);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
          throw error;
        } else {
          console.log(`${`${p}_4.json`} does not exist and will be skipped in final output.`);
        }
      }
    } else {
      for (const separate of creatorTagPathSeparate) {
        const targetPath = path.join(outputDir, `${separate}_4.json`);
        try {
          await fs.access(targetPath);
          finalNameList.push(separate);
          finalPathList.push(targetPath);
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
            throw error;
          } else {
            console.log(`${`${separate}_4.json`} does not exist and will be skipped in final output.`);
          }
        }
      }
    }
  }
  for (let i = 0; i < finalNameList.length; i++) {
    const data = await fs.readFile(finalPathList[i]!, "utf-8");
    finalData[finalNameList[i]!] = JSON.parse(data) as JsonMap;
  }
  await fs.writeFile(finalOutputPath, JSON.stringify(finalData, null, 2));
  console.log(`Saving ${finalOutputPath}`);
}
console.log("  end final output");
//#endregion

//#region jsonc conversion
console.log("start jsonc conversion");
{
  // jsoncフォルダ内の全てのjsoncファイルをjsonに変換して保存
  const jsoncDir = path.join(outputDir, "jsonc");
  const jsonDir = path.join(outputDir, "json");
  await fs.mkdir(jsonDir, { recursive: true });
  const files = await fs.readdir(jsoncDir);
  for (const file of files) {
    if (/\.jsonc$/.test(file)) {
      const srcFilePath = path.join(jsoncDir, file);
      const outFilePath = path.join(jsonDir, file.replace(/\.jsonc$/, ".json"));
      const rawJsonc = await fs.readFile(srcFilePath, "utf-8");
      const jsoncData = JSONC.parse(rawJsonc);
      await fs.writeFile(outFilePath, JSON.stringify(jsoncData));
      console.log(`Saving ${outFilePath}`);
    }
  }
}
console.log("  end jsonc conversion");
//#endregion
