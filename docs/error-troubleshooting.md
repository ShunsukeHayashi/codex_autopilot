# Codex MCP Hub トラブルシューティングガイド

このドキュメントでは、Codex MCP Hubを使用する際に発生する可能性のある一般的な問題とその解決方法を説明します。

## GitHub Actions エラー

### 1. Codex CLIの認証エラー

**症状**: GitHub Actionsでコードが生成されず、認証エラーが発生する

**解決策**:
1. リポジトリの Settings > Secrets and variables > Actions に移動
2. `OPENAI_API_KEY` シークレットを追加または更新
3. シークレットの値に有効なOpenAI APIキーを入力

**ワークフローファイルの修正**:
```yaml
- name: Authenticate Codex CLI
  run: |
    echo "Authenticating Codex CLI with API key..."
    echo "OPENAI_API_KEY=${{ secrets.OPENAI_API_KEY }}" > .env
    codex auth --key "${{ secrets.OPENAI_API_KEY }}"
```

### 2. ワークフローのパーミッションエラー

**症状**: GitHub Actionsが実行されても、コードのプッシュやPR作成ができない

**解決策**:
1. ワークフローファイルの `permissions` セクションを確認
2. 以下のパーミッションが設定されていることを確認:
   ```yaml
   permissions:
     contents: write
     pull-requests: write
     issues: write
   ```

## Webhook エラー

### 1. Webhookが届かない

**症状**: GitHub上でアクションを実行してもMCP Orchestratorにイベントが届かない

**確認項目**:
1. Webhook設定が正しいか確認（Settings > Webhooks）
   - Payload URLが正しいか
   - Content typeが `application/json` か
   - Secretが環境変数と一致しているか
2. Webhookの Recent Deliveries でステータスを確認

**解決策**:
- ペイロードURLが公開されているか確認（ローカル開発ではngrokなどが必要）
- シークレットが正しく設定されているか確認
- イベントタイプ（Issue comments, Pull requests など）が適切に選択されているか確認

### 2. Webhookの署名検証エラー

**症状**: Webhookリクエストが届くが、`signature verification failed` エラーが発生

**解決策**:
1. GitHub Webhook Secretを再生成
2. 新しいシークレットをGitHub Webhookの設定と `.env` ファイルの両方に設定

## Codex CLI エラー

### 1. モデル利用制限エラー

**症状**: `Rate limit reached` や `Model capacity exceeded` などのエラー

**解決策**:
1. OpenAI APIアカウントの利用制限を確認
2. 使用量を監視し、必要に応じてプランをアップグレード
3. リトライロジックを実装

### 2. コマンド実行エラー

**症状**: `codex run` コマンドが失敗する

**解決方法**:
1. `codex doctor` を実行して診断情報を確認
2. ローカルでの認証状態を確認: `codex auth status`
3. APIキーの有効性を確認

## Redis接続エラー

**症状**: `Redis connection error` や `Cannot connect to Redis` などのエラー

**解決策**:
1. Redisサーバーが実行中か確認: `docker ps | grep redis`
2. Redis接続URLが正しく設定されているか確認: `.env` ファイルの `REDIS_URL`
3. ネットワーク接続を確認（Dockerネットワーク設定など）

## 通知サービスエラー

### 1. LINE Bot エラー

**症状**: LINE通知が送信されない

**確認項目**:
1. LINE Channel Access TokenとChannel Secretが正しく設定されているか
2. LINE Messaging APIのエンドポイントが正常か
3. LINE Developerコンソールでのエラーログ

### 2. Discord Bot エラー

**症状**: Discord通知が送信されない

**確認項目**:
1. Discord Bot TokenとClient IDが正しく設定されているか
2. BotがDiscordサーバーに招待されているか
3. Botに適切な権限が付与されているか

## ロギングとデバッグ

問題のトラブルシューティングには、適切なロギングが役立ちます：

1. GitHub Actionsのログを確認
2. MCP Orchestratorのログを確認: `docker-compose logs -f orchestrator`
3. ワーカーのログを確認: `docker-compose logs -f line-worker discord-worker`
4. Redisのログを確認: `docker-compose logs -f redis`

## サポート

さらに支援が必要な場合は、以下の方法でサポートを受けることができます：

1. GitHubリポジトリにIssueを作成
2. プロジェクトの管理者に直接連絡
3. プロジェクトのドキュメントを参照