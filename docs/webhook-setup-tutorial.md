# GitHub Webhook 設定チュートリアル

このチュートリアルでは、Codex MCP Hubに必要なGitHub Webhookを設定する方法を詳しく説明します。

## Webhookとは

WebhookはGitHubのイベント（Issue作成、コメント、PRなど）が発生したときに、自動的に指定したURLにHTTP POSTリクエストを送信する機能です。これにより、GitHubのイベントに応じて外部サービス（MCP Orchestrator）を起動することができます。

## 設定手順

### 1. MCP Orchestratorの準備

Webhookを受け取るためには、MCP Orchestratorが起動していて、インターネットからアクセス可能である必要があります。

#### 開発環境の場合

ローカル環境を一時的に公開するには、以下のサービスのいずれかを使用します：

- **ngrok**: `ngrok http 3000`
- **localtunnel**: `lt --port 3000`

実行すると、一時的な公開URLが表示されます。このURLを控えておきます。

#### 本番環境の場合

サーバーにデプロイしたMCP OrchestratorのURL（例：`https://your-domain.com`）を使用します。

### 2. GitHubでのWebhook設定

1. リポジトリページで **Settings** タブをクリック
2. 左側メニューから **Webhooks** を選択
3. **Add webhook** ボタンをクリック
4. 以下の情報を入力：

#### 基本設定

- **Payload URL**:
  - 開発環境: `https://xxxx-xxxx-xxxx.ngrok.io/webhook/github` (ngrokのURL + パス)
  - 本番環境: `https://your-domain.com/webhook/github`

- **Content type**: `application/json` を選択

- **Secret**: `.env`ファイルの`GITHUB_WEBHOOK_SECRET`と同じ値
  - 例: `development-secret` (開発環境の場合)
  - 本番環境では強力なランダム文字列を使用（`openssl rand -hex 20`で生成可能）

#### SSL検証

- **Enable SSL verification**: 有効のままにする

#### イベント設定

「**Let me select individual events**」を選択し、以下のイベントにチェックを入れる：

- **Issue comments**
  - `/codex`コマンドを検出するために必要
- **Pull requests**
  - PR作成、マージなどのイベントを検出
- **Pull request reviews**
  - コードレビューアクションを検出

#### 保存

「**Add webhook**」ボタンをクリックして保存

### 3. 設定の確認

Webhook設定後、GitHubは自動的にPingイベントを送信します。

1. Webhook設定画面で **Recent Deliveries** タブを確認
2. Pingイベントのステータスが「200 OK」になっていることを確認

## ローカル環境での動作確認

1. MCP Orchestratorを起動:
   ```bash
   cd codex-mcp-hub
   npm run dev
   ```

2. ngrokを起動（別のターミナルで）:
   ```bash
   ngrok http 3000
   ```

3. ngrokが表示するURLをWebhookのPayload URLとして設定

4. GitHubリポジトリのIssueに新しいコメントを追加:
   ```
   /codex test hello world
   ```

5. MCP Orchestratorのログを確認:
   ```bash
   docker-compose logs -f orchestrator
   ```

## トラブルシューティング

### Webhookが届かない

1. Payload URLが正しく、インターネットからアクセス可能か確認
2. ngrokのURLが有効か確認（セッションが切れると変わります）
3. Content typeが`application/json`になっているか確認

### 署名検証エラー

1. Webhook SecretとGITHUB_WEBHOOK_SECRETが一致しているか確認
2. 余分な空白や改行がないか確認

### イベントが処理されない

1. 必要なイベントがWebhook設定で選択されているか確認
2. MCP Orchestratorのコードでイベントハンドラーが正しく設定されているか確認

## 注意事項

- Webhook URLはインターネットからアクセス可能である必要があります
- 開発環境では、ngrokのURLは定期的に変更されるため、Webhook URLも更新する必要があります
- シークレットは十分に複雑なものを使用し、定期的に更新することをお勧めします

## 参考リンク

- [GitHub Webhooks Documentation](https://docs.github.com/en/developers/webhooks-and-events/webhooks/about-webhooks)
- [ngrok Documentation](https://ngrok.com/docs)
- [localtunnel Documentation](https://github.com/localtunnel/localtunnel)