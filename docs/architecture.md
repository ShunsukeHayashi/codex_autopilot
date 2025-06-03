# Codex MCP Hub アーキテクチャ

## システム概要

Codex MCP Hub は、以下のコンポーネントで構成されています：

1. **OpenAI Codex CLI** - ターミナルで動作するコーディングエージェント
2. **GitHub App** - GitHub からのイベントを受け取る Webhook
3. **MCP Orchestrator** - イベントを処理し、適切なワーカーにタスクを分配
4. **LINE Bot ワーカー** - LINE 通知を処理
5. **Discord Bot ワーカー** - Discord 通知を処理
6. **Redis** - メッセージキューとデータストア

## アーキテクチャ図

```
┌─────────────┐    ┌─────────────┐
│  GitHub     │    │  Codex CLI  │
│  Issues/PRs │    │  (Terminal) │
└──────┬──────┘    └───────┬─────┘
       │                   │
       ▼                   ▼
┌──────────────────────────────────┐
│        GitHub Actions            │
│   (codex-autopilot.yml)          │
└──────────────────┬───────────────┘
                   │
                   ▼
┌──────────────────────────────────┐
│      GitHub App (MCP-Hub)        │
│     Webhook: /webhook/github     │
└──────────────────┬───────────────┘
                   │
                   ▼
┌──────────────────────────────────┐
│       MCP Orchestrator           │
│     (Express + Redis + Asynq)    │
└───┬─────────────┬────────────────┘
    │             │
    ▼             ▼
┌─────────────┐  ┌─────────────────┐
│  Redis      │  │  Worker Queues  │
│  Database   │◄─┤  gh-events      │
└─────────────┘  │  line           │
                 │  discord        │
                 └──┬─────────┬────┘
                    │         │
                    ▼         ▼
              ┌─────────┐ ┌──────────┐
              │ LINE    │ │ Discord  │
              │ Worker  │ │ Worker   │
              └────┬────┘ └────┬─────┘
                   │          │
                   ▼          ▼
              ┌─────────┐ ┌──────────┐
              │ LINE    │ │ Discord  │
              │ API     │ │ API      │
              └─────────┘ └──────────┘
```

## データフロー

1. **GitHub イベント発生**
   - Issue コメント (`/codex todo ...`)
   - PR オープン／マージ
   - コードレビュー

2. **GitHub Actions 実行**
   - `/codex` コマンドが検出されると、Codex CLI を起動
   - Codex CLI がコードを生成し、テストを実行、PR を作成

3. **GitHub Webhook 通知**
   - PR マージなどのイベントが GitHub App の Webhook に送信される
   - MCP Orchestrator が Webhook を受信

4. **MCP Orchestrator 処理**
   - イベントタイプを識別
   - 適切なキューにタスクを追加
   - Redis にデータを保存

5. **ワーカー処理**
   - LINE Bot ワーカーが通知を LINE に送信
   - Discord Bot ワーカーが通知を Discord に送信

## コンポーネント詳細

### OpenAI Codex CLI

- Node.js ベースのターミナルツール
- OpenAI API を使用してコード生成
- Git 操作（branch, add, commit, push）を自動化
- テスト実行と結果検証

### GitHub App (MCP-Hub)

- Webhook エンドポイント: `/webhook/github`
- 権限: Repository contents, Issues, Pull requests, Metadata
- イベント: Issue comments, Pull requests, Push

### MCP Orchestrator

- Express.js サーバー
- Redis キュー管理
- Webhook 処理
- ワーカーへのタスク分配

### Redis + Asynq

- メッセージキュー
  - `gh-events`: GitHub イベント処理
  - `line`: LINE 通知キュー
  - `discord`: Discord 通知キュー
- Dead letter キュー（失敗したタスク）
- データキャッシュ

### ワーカーサービス

- **LINE Bot ワーカー**
  - LINE Messaging API クライアント
  - テキストメッセージ送信
  - テンプレートベースのフォーマット

- **Discord Bot ワーカー**
  - Discord.js クライアント
  - Rich Embed メッセージ
  - サーバー通知

## デプロイ構成

### 開発環境

- Docker Compose による完全ローカル環境
- ngrok / localtunnel によるローカル Webhook 公開
- ホットリロードによる迅速な開発

### 本番環境

- GitHub Actions との統合
- クラウドデプロイ（AWS / GCP / Fly.io など）
- スケーラブルな Redis 構成（Redis Cluster / ElastiCache）
- 高可用性と障害耐性