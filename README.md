# MOVIE v6.1 — No-Fetch Fix

## 修正内容
- `movies.json` を `fetch()` する方式を廃止
- 300タイトルを `app.js` 内へ直接埋め込み
- GitHub Pages / ローカルHTMLのどちらでも起動可能
- `movies.json` は編集・確認用として残しているが、起動時には使用しない
- UI画像、スロット、ジャンル選択、観たい、視聴履歴、評価機能は維持

GitHubでは、このZIPを解凍した6ファイルをリポジトリ直下へ上書きしてください。
特に `app.js` と `index.html` は最新版へ置き換えてください。
