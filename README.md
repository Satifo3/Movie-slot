# MOVIE v6.17 — UI Restore

修正:
- v6.16で壊れていたUI画像参照を修正
- UI画像を `movie-ui-v617.jpeg` に統一
- CSS/JSも `style-v617.css` / `app-v617.js` に統一
- Safari/GitHub Pagesの古いキャッシュを避けるため `?v=617` を付与
- UI画像読み込み失敗時の再試行ガードを追加
- スロットUI、作品カード、背景、固定ナビを復元
- Netflix 500 / Disney+ 500 = 合計1000作品DBは維持
