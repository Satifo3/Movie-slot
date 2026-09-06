# MOVIE v6.14.4 — Japanese Title Display

- Netflix 500 + Disney+ 500 = 1000作品DBを維持
- DBには原題 titleOriginal を保持
- 既に日本語タイトルの作品はそのまま使用
- 英題しかない作品は日本語Wikipedia APIで日本語ページ名を取得
- 結果カード / 観たいリスト / 視聴履歴 / 評価画面で日本語タイトル優先表示
- 日本語ページ名を取得できない場合だけ原題へフォールバック
- SPIN処理はv6.14.3の安定版を維持
