# GitHub Webhook 詳細設定ガイド

この文書では、Codex MCP Hubのためのウェブフック設定について詳しく解説します。

## 前提条件

- GitHubリポジトリの管理者権限
- 公開アクセス可能なサーバー（開発中はngrokなどのトンネリングサービスも可）
- セットアップ済みのMCP Orchestrator

## Webhook設定手順

### 1. GitHub リポジトリ設定にアクセス

1. リポジトリページで **Settings** タブをクリック
2. 左側メニューから **Webhooks** を選択
3. **Add webhook** ボタンをクリック

### 2. Webhook 詳細の設定

以下の情報を入力します：

#### 基本設定

- **Payload URL**: Orchestratorのエンドポイント URL
  - 例: `https://your-domain.com/webhook/github`
  - 開発環境の場合: `https://xxxx-xxxx-xxxx.ngrok.io/webhook/github`

- **Content type**: `application/json` を選択

- **Secret**: セキュアなランダム文字列
  - このシークレットは`.env`ファイルの`GITHUB_WEBHOOK_SECRET`と完全に一致する必要があります
  - 例: `openssl rand -hex 20`で生成した値

#### SSL検証

- **Enable SSL verification**: 有効のままにしておく（推奨）
  - 開発環境でも、ngrokなどのサービスを使用する場合は有効にできます

#### イベント設定

「**Let me select individual events**」を選択し、以下のイベントにチェックを入れます：

- **Issue comments**
  - `/codex`コマンドはIssueコメントから検出されます
- **Pull requests**
  - PRのオープン、同期、マージなどのイベント
- **Pull request reviews**
  - PRレビューのアクション

その他のイベントは必要に応じて選択できますが、基本的には上記3つで十分です。

### 3. Webhook の動作確認

設定後、GitHubは確認のためにpingイベントを送信します。

1. Webhook設定画面で **Recent Deliveries** タブを確認
2. pingイベントの横にある緑のチェックマークが表示されていることを確認
   - エラーがある場合は赤い×印が表示されます

### 4. Webhook アクセス可能性の確認

Webhook URLが公開アクセス可能かを確認します：

1. MCP Orchestratorが実行中であることを確認
2. Orchestratorのログを監視: `docker-compose logs -f orchestrator`
3. テスト用にIssueにコメントを追加：
   ```
   /codex test hello world
   ```
4. ログにWebhookリクエスト受信のメッセージが表示されるか確認

## トラブルシューティング

### URLの到達可能性問題

**症状**: Webhook配信が失敗し、"URL not reachable" エラーが発生

**解決策**:
- Payload URLが公開アクセス可能か確認
- ファイアウォール設定を確認
- 開発環境の場合、ngrokなどのトンネルが正しく設定されているか確認

### 署名検証の失敗

**症状**: Webhook配信は成功するが、Orchestratorで署名検証エラーが発生

**解決策**:
- Webhook Secretが`.env`ファイルの設定と正確に一致しているか確認
- シークレットに不要な空白や改行が含まれていないか確認
- コンテンツタイプが`application/json`に設定されているか確認

### 期待するイベントが届かない

**症状**: 特定のイベントがOrchestratorに届かない

**解決策**:
- Webhook設定でそのイベントタイプが選択されているか確認
- GitHubのWebhook Recent Deliveriesタブでそのイベントの配信状況を確認
- Orchestratorのコードでそのイベントタイプのハンドラーが正しく定義されているか確認

## セキュリティのベストプラクティス

1. **強力なシークレット**: 長くランダムなシークレットを使用（20文字以上）
2. **最小権限の原則**: 必要なイベントのみを選択
3. **IP制限**: 可能であれば、Webhookを受け入れるサーバーのIP制限を設定
4. **HTTPS必須**: 常にHTTPSエンドポイントを使用
5. **定期的なシークレットの更新**: セキュリティのためにシークレットを定期的に更新

## 高度な設定

### カスタムヘッダー

追加のセキュリティレイヤーとして、カスタムヘッダーをOrchestrator側で検証することができます：

```javascript
app.post('/webhook/github', (req, res) => {
  // カスタムヘッダーの検証
  const customToken = req.headers['x-custom-token'];
  if (customToken !== process.env.CUSTOM_TOKEN) {
    return res.status(401).send('Unauthorized');
  }
  
  // 通常の処理を続行...
});
```

### イベントフィルタリング

特定の条件に基づいてイベントをフィルタリングすることができます：

```javascript
webhooks.on('issue_comment.created', ({ payload }) => {
  // 特定のユーザーからのコメントのみを処理
  if (payload.comment.user.login === 'authorized-user') {
    // 処理を続行...
  }
});
```

## Webhookのメンテナンス

- **定期的な監視**: Recent Deliveriesを定期的にチェックして失敗がないか確認
- **ログ管理**: Webhook関連のログを保存して問題調査に備える
- **通知設定**: Webhook配信の失敗時に通知を受け取るシステムを設定