#!/usr/bin/env node

/**
 * Codex MCP Hub Demo Script
 * 
 * このスクリプトはCodex MCP Hubの基本機能をデモするためのものです。
 * 実際のGitHubやLINE、Discordとの連携は行いませんが、
 * コマンドラインでCodex CLIの動作を確認することができます。
 */

const { exec } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

// Codex CLIがインストールされているか確認
const checkCodexInstalled = () => {
  return new Promise((resolve) => {
    exec('codex --version', (error, stdout) => {
      if (error) {
        console.log(`${colors.yellow}Codex CLIがインストールされていません。${colors.reset}`);
        console.log(`${colors.yellow}インストールするには:${colors.reset} npm install -g @openai/codex\n`);
        resolve(false);
      } else {
        console.log(`${colors.green}Codex CLI バージョン ${stdout.trim()} が見つかりました。${colors.reset}\n`);
        resolve(true);
      }
    });
  });
};

// Redisが実行中か確認
const checkRedisRunning = () => {
  return new Promise((resolve) => {
    exec('docker ps | grep redis', (error, stdout) => {
      if (error || !stdout) {
        console.log(`${colors.yellow}Redisが実行されていません。${colors.reset}`);
        console.log(`${colors.yellow}起動するには:${colors.reset} docker-compose -f docker-compose.dev.yml up -d\n`);
        resolve(false);
      } else {
        console.log(`${colors.green}Redisが実行中です。${colors.reset}\n`);
        resolve(true);
      }
    });
  });
};

// コマンドの入力を促す
const askForCommand = () => {
  rl.question(`${colors.cyan}コマンドを選択してください (1-4): ${colors.reset}`, (answer) => {
    switch(answer) {
      case '1':
        simulateCodexCommand('/codex todo 新しい機能を実装する');
        break;
      case '2':
        simulateCodexCommand('/codex fix バグを修正する');
        break;
      case '3':
        simulateCodexCommand('/codex test テストを作成する');
        break;
      case '4':
        console.log(`\n${colors.green}デモを終了します。さようなら！${colors.reset}`);
        rl.close();
        break;
      default:
        console.log(`${colors.yellow}無効な選択です。1から4の数字を入力してください。${colors.reset}\n`);
        askForCommand();
    }
  });
};

// Codexコマンドのシミュレーション
const simulateCodexCommand = (command) => {
  console.log(`\n${colors.blue}GitHub Issueでコマンドを受信: ${colors.reset}${command}`);
  console.log(`${colors.blue}GitHub Actionsをトリガー中...${colors.reset}`);
  
  setTimeout(() => {
    console.log(`${colors.green}Codex CLIを起動中...${colors.reset}`);
    
    setTimeout(() => {
      console.log(`${colors.green}コードを生成中...${colors.reset}`);
      
      setTimeout(() => {
        console.log(`${colors.green}テストを実行中...${colors.reset}`);
        
        setTimeout(() => {
          console.log(`${colors.green}PR #123を作成中...${colors.reset}`);
          
          setTimeout(() => {
            console.log(`${colors.green}MCP Orchestratorに通知を送信中...${colors.reset}`);
            
            setTimeout(() => {
              console.log(`${colors.green}LINE Botワーカーに通知を送信中...${colors.reset}`);
              
              setTimeout(() => {
                console.log(`${colors.green}Discord Botワーカーに通知を送信中...${colors.reset}`);
                
                setTimeout(() => {
                  console.log(`\n${colors.magenta}プロセス完了！${colors.reset}`);
                  console.log(`${colors.cyan}生成されたPRはこちらで確認できます: ${colors.reset}https://github.com/username/repo/pull/123\n`);
                  askForCommand();
                }, 1000);
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
};

// デモを実行
(async () => {
  await checkCodexInstalled();
  await checkRedisRunning();

  console.log(`${colors.blue}===== Codex MCP Hub デモ =====\n${colors.reset}`);
  console.log(`${colors.magenta}次のようなGitHubコマンドをシミュレートします:${colors.reset}`);
  console.log(`1. /codex todo 新しい機能を実装する`);
  console.log(`2. /codex fix バグを修正する`);
  console.log(`3. /codex test テストを作成する`);
  console.log(`4. 終了\n`);

  askForCommand();
})();