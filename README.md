# EH-tag-list-generator

## 概要

EH のタグ情報を取得・整形し、配布しやすい JSON / JSONC 形式へ変換して出力する TypeScript 製の生成ツールです。

このツールは `tag1` から `tag4` までの段階的な処理を通じて、カテゴリ別のタグデータを作成し、最終的に統合データを生成します。

## インストール

前提:

- Node.js 20 以上を推奨
- npm

セットアップ:

```bash
npm install
```

## 使用方法

生成処理を実行します。

```bash
npm run main
```

`npm run main` は次を実行します。

1. TypeScript をビルド (`tsc -b`)
2. 生成スクリプトを実行 (`node dist/main.js`)

`node dist/main.js` の処理の最後で、`data/jsonc` 配下にある全ての `.jsonc` ファイルを走査し、自動的に `data/json` 配下へ `.json` として変換出力します。

## プログラム構成

### `src/main.ts`

- 全体の実行フローを管理するエントリーポイント
- `Tag1` から `Tag4` を順番に実行
- 最終統合データ `data/jsonc/data1.jsonc` を生成
- `data/jsonc` 配下の `.jsonc` を一括で `.json` に変換

### `src/tag1.ts`

- ehwiki のカテゴリ API からタグ ID とタイトルを収集
- ページング (`cmcontinue`) を辿って全件取得
- カテゴリごとの初期データ (`*_1.json`) を作成

### `src/tag2.ts`

- `tag1` の ID リストを元に、各ページの本文を API で取得
- 50件単位で `pageids` をまとめて取得
- 取得成功データと失敗 ID を整理して `*_2.json` を作成

### `src/tag3.ts`

- wiki本文から日本語名を抽出・正規化（HTMLエンティティ復号、全角括弧の正規化など）
- `tag3`: 一般カテゴリ向けの抽出
- `tag3Creator`: Creator カテゴリ向けに artist / circle を判定して分離
- 抽出結果を `*_3.json` として出力

### `src/tag4.ts`

- 元タイトルと翻訳結果を突合し、`title -> 日本語名` の辞書を生成
- 失敗 ID を収集しつつ、キー順ソートした最終カテゴリデータ (`*_4.json`) を作成

## 出力

主な出力先は `data` 配下です。

- `data/*_1.json` から `data/*_4.json`: 各処理段階の中間成果物
- `data/jsonc/data1.jsonc`: 最終統合データ (JSONC)
- `data/json/*.json`: `data/jsonc` 配下の全 `.jsonc` から自動変換された JSON

## 開発

ビルドのみ実行する場合:

```bash
tsc -b
```

## ライセンス

MIT ライセンスです。詳細は [LICENSE](LICENSE) を参照してください。

## 注意事項

- 既存の出力ファイルがある場合、同名の一部ファイルはスキップされます。
- 取得元データの仕様変更により、出力内容が変化する場合があります。
