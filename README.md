# MOVIE v3 Pixel Arcade

GitHub Pages向けの300タイトル映画ルーレット。

## v3変更点
- スロット筐体をよりゲームセンター的なピクセルUIへ刷新
- リール内を作品タイトル＋ジャンル記号で高速/中速/低速に切り替える演出
- 抽選結果に作品ごとの「オリジナル・ドット絵風ポスター」を自動生成
- ポスターは公式画像を複製せず、ジャンル・タイトル・抽象モチーフからCanvasで生成
- 既存の300タイトル分類・AND条件フィルタは維持
- GitHub Pages向け4ファイル構成

## 公開
`index.html`, `style.css`, `app.js`, `movies.json` をリポジトリ直下へ置き、
Settings → Pages → Deploy from a branch → main / root。
