# MOVIE Prototype 300

GitHub Pages向けの映画・アニメ抽選アプリ試作版です。

## 公開方法
1. GitHubで新規リポジトリを作成
2. このZIPを解凍
3. `index.html`, `style.css`, `app.js`, `movies.json` をリポジトリ直下へアップロード
4. Settings → Pages → Deploy from a branch
5. Branchを `main` / `/ (root)` にして保存

## データ
- 300件のレコードを収録
- `verified: true` は2026-09-06時点で公式配信ページ上で確認できた作品
- `verified: false` はUI/検索/抽選の負荷テストとデータ構造確認用候補
- `PROTOTYPE TITLE xxx` は正式タイトル差し替え用スロット

公開版にする前に配信状況を公式サイト/API等で再確認してください。
