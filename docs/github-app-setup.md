# GitHub App のセットアップ手順

このドキュメントでは、Codex MCP Hub 用の GitHub App を作成する方法を説明します。

## 1. GitHub App の作成

1. [GitHub Developer Settings](https://github.com/settings/apps) にアクセスします。

2. "New GitHub App" ボタンをクリックします。

3. 以下の情報を入力します：
   - GitHub App name: `MCP-Hub` (または任意の名前)
   - Homepage URL: あなたのプロジェクトのホームページまたはリポジトリ URL
   - Webhook URL: `https://your-domain.com/webhook/github`
   - Webhook secret: 任意の安全な文字列（後で `.env` ファイルに設定します）

4. 権限を設定します：
   - Repository permissions:
     - Contents: Read & write
     - Issues: Read & write
     - Metadata: Read-only
     - Pull requests: Read & write
   - Organization permissions:
     - Members: Read-only
   - Account permissions:
     - None required

5. サブスクライブするイベントを選択します：
   - Issue comment
   - Issues
   - Pull request
   - Pull request review
   - Pull request review comment
   - Push

6. "Create GitHub App" ボタンをクリックします。

## 2. プライベートキーの生成

1. 作成した GitHub App の設定ページで、"Private keys" セクションまでスクロールします。

2. "Generate a private key" ボタンをクリックします。

3. ダウンロードされた `.pem` ファイルを安全な場所に保存します。このファイルは後で `.env` ファイルに設定します。

## 3. アプリのインストール

1. GitHub App の設定ページで、左側のサイドバーから "Install App" をクリックします。

2. アプリをインストールするアカウント（個人またはOrganization）を選択します。

3. インストールするリポジトリを選択します：
   - すべてのリポジトリ
   - または特定のリポジトリのみ

4. "Install" ボタンをクリックします。

## 4. 環境変数の設定

以下の環境変数を `.env` ファイルに設定します：

```
GITHUB_APP_ID=<GitHub App ID>
GITHUB_PRIVATE_KEY=<プライベートキーの内容（改行を \n で置換）>
GITHUB_WEBHOOK_SECRET=<Webhook シークレット>
```

プライベートキーは複数行にわたるため、以下のコマンドを使用して適切な形式に変換できます：

```bash
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' your-private-key.pem
```

## 5. Webhook URL の設定

GitHub App の Webhook URL は、MCP Orchestrator がデプロイされている URL に設定する必要があります。開発環境では、以下のようなサービスを使用して、ローカル環境を公開することができます：

- [ngrok](https://ngrok.com/)
- [localtunnel](https://localtunnel.github.io/www/)

例えば、ngrok を使用する場合：

```bash
ngrok http 3000
```

表示された URL + `/webhook/github` を GitHub App の Webhook URL として設定します。

## 6. 動作確認

1. GitHub リポジトリの Issue に新しいコメントを追加し、`/codex todo something` のようなコマンドを入力します。

2. GitHub Actions が実行され、Codex CLI がコードを生成して PR を作成するはずです。

3. PR がマージされると、LINE Bot と Discord Bot が通知を送信するはずです。

## トラブルシューティング

- **Webhook が届かない場合**: GitHub App の設定で Webhook の Delivery を確認し、エラーがあれば修正します。

- **GitHub Actions が実行されない場合**: リポジトリの Actions 設定で、ワークフローが有効になっていることを確認します。

- **Codex CLI エラー**: Codex CLI が適切にインストールされており、`OPENAI_API_KEY` が設定されていることを確認します。

- **通知が送信されない場合**: Redis 接続と、LINE/Discord の認証情報が正しく設定されていることを確認します。