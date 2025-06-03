# Codex MCP Hub

OpenAI **Codex CLI** × GitHub App × MCP Orchestrator で ―

1️⃣ **Issue／PR／コメント** をトリガーとした "コード生成 → テスト →デプロイ" を **Codex CLI** が担当。
2️⃣ 並列ワーカー（LINE Bot／Discord Bot／GitHub Worker）が MCP キュー上で同時動作。
3️⃣ すべて **CLI（ターミナル）完結**・**マルチプロセス**・**創造性 120-130 %** のフローを実現。

## 必要条件

- Node.js 22+
- Redis 7+
- OpenAI API キー
- GitHub アカウント
- LINE Messaging API アカウント（オプション）
- Discord Bot トークン（オプション）

## インストール方法

### 1. OpenAI Codex CLI のインストール

```bash
npm install -g @openai/codex
```

### 2. リポジトリのクローン

```bash
git clone https://github.com/yourusername/codex-mcp-hub.git
cd codex-mcp-hub
```

### 3. 依存関係のインストール

```bash
npm install
```

### 4. 環境変数の設定

`.env.example` ファイルを `.env` にコピーして、必要な環境変数を設定します。

```bash
cp .env.example .env
```

## GitHub App の作成

1. GitHub で新しい GitHub App を作成します：
   - GitHub のデベロッパー設定 → GitHub Apps → New GitHub App
   - Webhook URL: `https://your-domain.com/webhook/github`
   - Webhook secret: 任意の安全な文字列（.env ファイルにも設定）
   - 必要な権限：
     - Repository contents: Read & write
     - Pull requests: Read & write
     - Issues: Read & write
     - Metadata: Read-only

2. 作成後、以下の情報を `.env` ファイルに設定：
   - `GITHUB_APP_ID`
   - `GITHUB_PRIVATE_KEY`
   - `GITHUB_WEBHOOK_SECRET`

3. アプリをリポジトリにインストールします。

## 使い方

### ローカル開発環境の起動

```bash
docker-compose up -d
```

### コマンドラインからの利用

Issue コメントに `/codex todo [タスク内容]` を書き込むことで、Codex が自動的にコードを生成し、テストを実行して PR を作成します。

例：
```
/codex todo ユーザー登録機能の実装
```

### CI/CD パイプラインでの使用

GitHub Actions を使用して、PR がマージされたときに自動的に LINE と Discord に通知が送信されます。

## ディレクトリ構造

```
.
├── .github/workflows/       # GitHub Actions ワークフロー
├── orchestrator/            # MCP Orchestrator
│   ├── src/                 # ソースコード
│   └── config/              # 設定ファイル
├── workers/                 # ワーカーサービス
│   ├── line/                # LINE Bot ワーカー
│   └── discord/             # Discord Bot ワーカー
├── codex.json               # Codex CLI 設定
├── docker-compose.yml       # Docker Compose 設定
├── .env                     # 環境変数（git 管理外）
└── README.md                # このファイル
```

## ライセンス

MIT

## 参考リンク

- [OpenAI Codex CLI – Getting Started](https://help.openai.com/en/articles/11096431-openai-codex-cli-getting-started)
- [GitHub: openai/codex](https://github.com/openai/codex)
- [OpenAI Codex CLI Tutorial - DataCamp](https://www.datacamp.com/tutorial/open-ai-codex-cli-tutorial)