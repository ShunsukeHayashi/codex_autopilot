#!/usr/bin/env node

/**
 * Codex MCP Hub Simple Demo
 * 
 * このスクリプトはCodex MCP Hubの基本的な流れをシミュレートします。
 */

const { execSync } = require('child_process');

// ANSIカラーコード
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m',
};

// バナーを表示
console.log(`${colors.cyan}${colors.bright}
  _____          _            __  __  _____ _____    _    _       _     
 / ____|        | |          |  \\/  |/ ____|  __ \\  | |  | |     | |    
| |     ___   __| | _____  __| \\  / | |    | |__) | | |__| |_   _| |__  
| |    / _ \\ / _\` |/ _ \\ \\/ /| |\\/| | |    |  ___/  |  __  | | | | '_ \\ 
| |___| (_) | (_| |  __/>  < | |  | | |____| |      | |  | | |_| | |_) |
 \\_____\\___/ \\__,_|\\___/_/\\_\\|_|  |_|\\_____|_|      |_|  |_|\\__,_|_.__/ 
                                                                         
${colors.reset}${colors.yellow}Codex CLI × GitHub App × MCP Orchestrator デモ${colors.reset}
`);

console.log(`${colors.green}このデモではCodex CLIの基本機能をシミュレートします。${colors.reset}`);
console.log(`${colors.green}実際のGitHubやLINE、Discordとの連携は行いません。${colors.reset}\n`);

// 環境チェック
try {
  const codexVersion = execSync('codex --version').toString().trim();
  console.log(`${colors.green}Codex CLI バージョン ${codexVersion} が見つかりました。${colors.reset}\n`);
} catch (error) {
  console.log(`${colors.yellow}Codex CLIがインストールされていません。${colors.reset}`);
  console.log(`${colors.yellow}インストールするには:${colors.reset} npm install -g @openai/codex\n`);
}

try {
  const redisRunning = execSync('docker ps | grep redis').toString();
  if (redisRunning) {
    console.log(`${colors.green}Redisが実行中です。${colors.reset}\n`);
  }
} catch (error) {
  console.log(`${colors.yellow}Redisが実行されていません。${colors.reset}`);
  console.log(`${colors.yellow}起動するには:${colors.reset} docker-compose -f docker-compose.dev.yml up -d\n`);
}

// ワークフローをシミュレート
console.log(`${colors.blue}===== Codex MCP Hub ワークフローデモ =====\n${colors.reset}`);
console.log(`${colors.blue}GitHub Issueでコマンドを受信: ${colors.reset}/codex todo ユーザー登録機能を実装する`);
console.log(`${colors.blue}GitHub Actionsをトリガー中...${colors.reset}`);
console.log(`${colors.green}Codex CLIを起動中...${colors.reset}`);

// サンプルコードの生成をシミュレート
console.log(`${colors.green}コードを生成中...${colors.reset}`);
console.log(`
${colors.cyan}生成されたコード:${colors.reset}

\`\`\`javascript
// ユーザー登録機能
function registerUser(userData) {
  // 入力バリデーション
  if (!userData.email || !userData.password) {
    throw new Error('メールアドレスとパスワードは必須です');
  }
  
  // メールアドレスの形式をチェック
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(userData.email)) {
    throw new Error('メールアドレスの形式が正しくありません');
  }
  
  // パスワードの強度をチェック
  if (userData.password.length < 8) {
    throw new Error('パスワードは8文字以上である必要があります');
  }
  
  // ユーザーの登録処理
  const user = {
    id: generateUserId(),
    email: userData.email,
    password: hashPassword(userData.password),
    createdAt: new Date(),
    ...userData
  };
  
  // データベースに保存
  saveUserToDatabase(user);
  
  // 確認メールを送信
  sendConfirmationEmail(user.email);
  
  return {
    userId: user.id,
    createdAt: user.createdAt
  };
}
\`\`\`
`);

console.log(`${colors.green}テストを実行中...${colors.reset}`);

// テスト結果をシミュレート
console.log(`${colors.green}テスト結果:${colors.reset}
PASS src/user/register.test.js
  ユーザー登録機能
    ✓ 正しい情報で登録できること (15ms)
    ✓ メールアドレスが必須であること (2ms)
    ✓ パスワードが必須であること (1ms)
    ✓ メールアドレスの形式が正しくない場合はエラーになること (3ms)
    ✓ パスワードが8文字未満の場合はエラーになること (1ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        1.512 s
`);

console.log(`${colors.green}PR #123を作成中...${colors.reset}`);
console.log(`${colors.green}MCP Orchestratorに通知を送信中...${colors.reset}`);
console.log(`${colors.green}LINE Botワーカーに通知を送信中...${colors.reset}`);
console.log(`${colors.green}Discord Botワーカーに通知を送信中...${colors.reset}`);

console.log(`\n${colors.magenta}プロセス完了！${colors.reset}`);
console.log(`${colors.cyan}生成されたPRはこちらで確認できます: ${colors.reset}https://github.com/ShunsukeHayashi/codex_autopilot/pull/123\n`);

// LINEとDiscordへの通知例
console.log(`${colors.yellow}LINE通知例:${colors.reset}`);
console.log(`
🎉 PR マージ通知 🎉

タイトル: feat: ユーザー登録機能の実装
PR #123
リポジトリ: ShunsukeHayashi/codex_autopilot
マージ実行者: ShunsukeHayashi
マージ時間: 2025/06/03 13:00:00

🔗 詳細: https://github.com/ShunsukeHayashi/codex_autopilot/pull/123

✅ CI/CD ワークフローが実行中です。
デプロイ完了までしばらくお待ちください。
`);

console.log(`${colors.magenta}Discord通知例:${colors.reset}`);
console.log(`
@everyone
**PR #123 がマージされました: ユーザー登録機能の実装**
リポジトリ: ShunsukeHayashi/codex_autopilot
ブランチ: master
変更: +120 / -5
マージ者: ShunsukeHayashi
時間: 2025/06/03 13:00:00
`);

console.log(`\n${colors.green}デモ完了！実際の使用には環境変数の設定とGitHub Appの作成が必要です。${colors.reset}`);
console.log(`${colors.green}詳細は docs/quick-start.md を参照してください。${colors.reset}\n`);