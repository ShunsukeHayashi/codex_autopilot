# Codex MCP Hub クイックスタートガイド

このガイドでは、Codex MCP Hub を素早くセットアップして実行する方法を説明します。

## 前提条件

- Node.js 22+
- Docker と Docker Compose
- OpenAI API キー
- GitHub アカウント

## ステップ 1: リポジトリをクローン

```bash
git clone https://github.com/yourusername/codex-mcp-hub.git
cd codex-mcp-hub
```

## ステップ 2: 環境変数の設定

`.env.example` ファイルをコピーして `.env` ファイルを作成します：

```bash
cp .env.example .env
```

必要な環境変数を設定します：

```bash
# 最低限必要な設定
OPENAI_API_KEY=your_openai_api_key
GITHUB_WEBHOOK_SECRET=your_webhook_secret
GITHUB_APP_ID=your_github_app_id
GITHUB_PRIVATE_KEY=your_github_private_key
```

## ステップ 3: Docker Compose で起動

```bash
docker-compose up -d
```

これにより、以下のサービスが起動します：
- Redis
- MCP Orchestrator
- LINE Bot ワーカー
- Discord Bot ワーカー

## ステップ 4: GitHub App のセットアップ

`docs/github-app-setup.md` の手順に従って、GitHub App を作成し、リポジトリにインストールします。

## ステップ 5: Codex CLI のインストール

```bash
npm install -g @openai/codex
```

Codex CLI の認証を行います：

```bash
codex auth
```

プロンプトに従って、OpenAI API キーを入力します。

## ステップ 6: GitHub リポジトリの設定

リポジトリのルートディレクトリに `codex.json` ファイルを作成します：

```json
{
  "policy": "full-auto",
  "preferred_branch": "codex/${hash}",
  "test_command": "npm test",
  "auto_approve": ["README.md", "docs/**"]
}
```

## ステップ 7: GitHub Actions の設定

リポジトリの `.github/workflows` ディレクトリに `codex-autopilot.yml` ファイルを追加します。このファイルは既にこのリポジトリに含まれています。

## ステップ 8: 使ってみる

1. リポジトリの Issue に新しいコメントを追加し、`/codex todo` コマンドを使用します：

```
/codex todo ユーザー登録フォームを作成する
```

2. GitHub Actions が実行され、Codex CLI がコードを生成し、PR を作成します。

3. PR がマージされると、LINE と Discord に通知が送信されます。

## トラブルシューティング

- サービスのログを確認します：

```bash
docker-compose logs -f orchestrator
docker-compose logs -f line-worker
docker-compose logs -f discord-worker
```

- Webhook が届いているか確認します：

```bash
docker-compose logs -f orchestrator | grep webhook
```

- Codex CLI の診断を実行します：

```bash
codex doctor
```

## 詳細なドキュメント

- [GitHub App のセットアップ](./github-app-setup.md)
- [MCP Orchestrator の詳細設定](./orchestrator-config.md)
- [ワーカーサービスのカスタマイズ](./worker-customization.md)

## 参考リンク

- [OpenAI Codex CLI – Getting Started](https://help.openai.com/en/articles/11096431-openai-codex-cli-getting-started)
- [GitHub: openai/codex](https://github.com/openai/codex)
- [OpenAI Codex CLI Tutorial - DataCamp](https://www.datacamp.com/tutorial/open-ai-codex-cli-tutorial)