#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}    Codex MCP Hub クイックスタート    ${NC}"
echo -e "${BLUE}======================================${NC}\n"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo -e "${YELLOW}Dockerが実行されていません。Docker Desktopを起動してください。${NC}\n"
  exit 1
fi

# Check if Codex CLI is installed
if ! command -v codex > /dev/null 2>&1; then
  echo -e "${YELLOW}Codex CLIがインストールされていません。インストールしますか？(y/n)${NC}"
  read -r answer
  if [[ "$answer" =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}Codex CLIをインストール中...${NC}"
    npm install -g @openai/codex
  else
    echo -e "${YELLOW}Codex CLIはこのシステムの使用に必要です。後でインストールしてください。${NC}"
  fi
fi

# Ensure Redis is running
echo -e "${GREEN}Redisを起動中...${NC}"
docker-compose -f docker-compose.dev.yml up -d

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo -e "${YELLOW}.envファイルが見つかりません。.env.exampleからコピーして作成しますか？(y/n)${NC}"
  read -r answer
  if [[ "$answer" =~ ^[Yy]$ ]]; then
    cp .env.example .env
    echo -e "${GREEN}.envファイルを作成しました。必要な認証情報を設定してください。${NC}"
    echo -e "${YELLOW}重要: 特に以下の設定を行ってください:${NC}"
    echo -e "  - OPENAI_API_KEY"
    echo -e "  - GITHUB_WEBHOOK_SECRET"
    echo -e "  - GITHUB_APP_ID"
    echo -e "  - GITHUB_APP_TOKEN\n"
  fi
fi

# Ask if user wants to run the demo
echo -e "${CYAN}Codex MCP Hubのデモを実行しますか？(y/n)${NC}"
read -r answer
if [[ "$answer" =~ ^[Yy]$ ]]; then
  node simple-demo.js
fi

# Display next steps
echo -e "\n${GREEN}セットアップ完了！${NC}"
echo -e "${CYAN}次のステップ:${NC}"
echo -e "1. GitHub Appを作成する (docs/github-app-setup.md)"
echo -e "2. .envファイルに認証情報を設定する"
echo -e "3. 開発サーバーを起動する: ${GREEN}npm run dev${NC}"
echo -e "4. GitHubリポジトリでCodex CLIコマンドを使用する: ${GREEN}/codex todo [タスク内容]${NC}\n"

echo -e "${YELLOW}詳細なドキュメントは docs/ ディレクトリをご覧ください。${NC}"