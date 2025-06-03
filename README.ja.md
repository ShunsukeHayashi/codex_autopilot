# Codex MCP Hub

OpenAI **Codex CLI** × GitHub App × MCP Orchestrator で ―

1️⃣ **Issue／PR／コメント** をトリガーとした "コード生成 → テスト →デプロイ" を **Codex CLI** が担当。
2️⃣ 並列ワーカー（LINE Bot／Discord Bot／GitHub Worker）が MCP キュー上で同時動作。
3️⃣ すべて **CLI（ターミナル）完結**・**マルチプロセス**・**創造性 120-130 %** のフローを実現。

## クイックスタート

```bash
# リポジトリをクローン
git clone https://github.com/ShunsukeHayashi/codex_autopilot.git
cd codex_autopilot

# クイックスタートスクリプトを実行
./quick-start.sh
```

## 必要条件

- Node.js 22+
- Docker と Docker Compose
- OpenAI API キー
- GitHub アカウント
- LINE Messaging API アカウント（オプション）
- Discord Bot トークン（オプション）

## 基本的な使い方

### GitHub での利用

Issue コメントに `/codex todo [タスク内容]` を書き込むことで、Codex が自動的にコードを生成し、テストを実行して PR を作成します。

例：
```
/codex todo ユーザー登録機能の実装
```

PR に `codex-review` ラベルを付けると、自動的にコードレビューが行われます。

### ローカルでの使用

```bash
# 対話モードでの実行
codex run "新機能の実装"

# 自動モードでの実行（テスト実行とPR作成を含む）
codex run --auto "バグ修正の実装"
```

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

## トラブルシューティング

- **Codex CLI エラー**: `codex doctor` を実行して診断情報を確認
- **GitHub Actions が実行されない**: リポジトリの Secrets が正しく設定されているか確認
- **通知が送信されない**: Redis 接続と、LINE/Discord の認証情報が正しく設定されているか確認

## 詳細なドキュメント

- [クイックスタートガイド](./docs/quick-start.md)
- [GitHub App のセットアップ](./docs/github-app-setup.md)
- [アーキテクチャ概要](./docs/architecture.md)

## ライセンス

MIT