# EH-tag-list-generator

此文件由 AI 翻译，可能包含不准确之处。
如有差异，以日语原文为准。

---

## 语言与本地化

- 本地化文档统一在 `locales` 目录下管理。
- 翻译使用 AI。
- 本地化版本仅供参考，如有不一致，以日语原文为准。

### 各语言 README

- 日语(原文): [README.md](../../README.md)
- English (localized): [locales/en/README.md](../en/README.md)
- 中文(本地化): [locales/zh/README.md](../zh/README.md)
- 한국어(로컬라이즈): [locales/ko/README.md](../ko/README.md)

## 概述

这是一个基于 TypeScript 的生成工具，用于获取并整理 EH 标签信息，并以便于分发的 JSON / JSONC 格式输出。

该工具通过 `tag1` 到 `tag4` 的分阶段处理，构建按类别划分的标签数据，并最终生成整合数据。

运行后，可以获得可用于标签翻译工作的整合 JSON / JSONC 数据。

## 安装

前提条件:

- 推荐使用 Node.js 20 及以上版本
- npm

准备:

- 下载本仓库完整文件（或使用 `git clone`）并放置在本地电脑上。
- 在包含 `LICENSE` 等文件的项目根目录中执行以下命令（可使用 VS Code 终端，也可直接使用 PowerShell / 命令提示符）。

设置:

```bash
npm install
```

## 使用方法

执行生成流程:

```bash
npm run main
```

`npm run main` 会执行以下步骤。

1. 构建 TypeScript (`tsc -b`)
2. 执行生成脚本 (`node dist/main.js`)

在 `node dist/main.js` 的最后，会扫描 `data/jsonc` 下的所有 `.jsonc` 文件，并自动转换输出到 `data/json` 下的 `.json` 文件。

## 程序构成

### `src/main.ts`

- 管理整体执行流程的入口
- 按顺序执行 `Tag1` 到 `Tag4`
- 生成最终整合数据 `data/jsonc/data1.jsonc`
- 将 `data/jsonc` 下的 `.jsonc` 批量转换为 `.json`

### `src/tag1.ts`

- 从 ehwiki 分类 API 收集标签 ID 与标题
- 通过分页参数 (`cmcontinue`) 获取全部数据
- 生成各分类初始数据 (`*_1.json`)

### `src/tag2.ts`

- 基于 `tag1` 的 ID 列表，通过 API 获取各页面正文
- 以 50 条为一批请求 `pageids`
- 整理成功数据与失败 ID，生成 `*_2.json`

### `src/tag3.ts`

- 从 wiki 正文中提取并规范化日文名（HTML 实体解码、全角括号规范化等）
- `tag3`: 面向一般分类的提取
- `tag3Creator`: 面向 Creator 分类，区分 artist / circle
- 将提取结果输出为 `*_3.json`

### `src/tag4.ts`

- 对照原标题与翻译结果，生成 `title -> 日文名` 字典
- 收集失败 ID，并输出按键排序的最终分类数据 (`*_4.json`)

## 输出

主要输出目录为 `data`。

- `data/*_1.json` 到 `data/*_4.json`: 各处理阶段的中间产物
- `data/jsonc/data1.jsonc`: 最终整合数据 (JSONC)
- `data/json/*.json`: 由 `data/jsonc` 下全部 `.jsonc` 自动转换得到的 JSON

## 开发

仅执行构建:

```bash
tsc -b
```

## 许可证

采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE)。

## 注意事项

- 如果已存在输出文件，部分同名文件会被跳过。
- 若源数据规格发生变化，输出内容可能随之变化。
