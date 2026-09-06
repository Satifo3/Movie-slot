# MOVIE v6.5 — Official Poster Pixel Engine

この版は、300作品それぞれに `posterSource` を設定すると、
その元画像をブラウザ内で自動的に高品質ピクセル化して表示します。

## 変換処理
- 元ポスターを 80x120 に高品質縮小
- コントラスト / 彩度を調整
- 6x6x6 色量子化
- Bayer 4x4 ordered dithering
- 最近傍補間で 160x240 に拡大
- フィルム穴フレームを追加

## 使い方
`posters/001.jpg` ～ `posters/300.jpg` に画像を置き、
`movies.json` 各作品の `posterSource` に対応パスを入れるだけです。

`poster-map-template.json` に300件分のパス雛形も入っています。

※ アプリ本体には第三者の公式ポスター画像を同梱していません。
