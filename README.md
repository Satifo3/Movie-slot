# MOVIE v6.14 — Cache Clean Navigation Fix

今回の修正:
- UI画像内の古い下部ナビを除去した画像を再生成
- 画像名を `movie-ui-clean-v614.jpeg` に変更してSafari/GitHubキャッシュを回避
- CSSを `style-v614.css` に変更
- JSを `app-v614.js` に変更
- URLにも `?v=614` を付けてキャッシュを強制更新
- 画像内に残っていた古い透明ナビ5個をHTMLから完全削除
- 重複していた `homeWishBadge` を1個に統一
- 下部ナビは画面最下部のHTML固定ナビだけ

GitHub PagesではZIPの中身を全上書きしてください。
