# Codex CLI 認証トラブルシューティング

このガイドでは、Codex CLIの認証に関する問題とその解決方法について説明します。

## 一般的な問題と解決策

### 問題1: GitHub Actionsで認証エラーが発生する

GitHub Actionsで実行すると、Codex CLIが認証エラーで失敗することがあります。

#### 解決策:

1. **シークレットの設定確認**:
   - リポジトリの Settings > Secrets and variables > Actions に移動
   - `OPENAI_API_KEY` シークレットが正しく設定されているか確認

2. **ワークフローファイルの修正**:
   環境変数を明示的に設定し、非対話モードで実行するように修正します。

   ```yaml
   - name: Configure Environment
     run: |
       echo "OPENAI_API_KEY=${{ secrets.OPENAI_API_KEY }}" >> $GITHUB_ENV
       echo "Setting up non-interactive environment for Codex"

   - name: Run Codex Command
     env:
       OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
       GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
     run: |
       # --yes フラグで対話プロンプトをスキップ
       codex run --yes --auto "command here"
   ```

### 問題2: ターミナルでの対話的認証が機能しない

一部の環境では、`codex auth` コマンドがRaw modeエラーで失敗することがあります。

#### 解決策:

1. **環境変数を使用した認証**:
   ```bash
   export OPENAI_API_KEY=your_api_key_here
   ```

2. **直接API Key指定**:
   ```bash
   codex --api-key=your_api_key_here run "command"
   ```

3. **`.env` ファイルを使用**:
   プロジェクトのルートに `.env` ファイルを作成し、以下を記述:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

### 問題3: モデルの選択に関する問題

デフォルトのモデルが利用できない、または期待通りに動作しない場合があります。

#### 解決策:

1. **モデルを明示的に指定**:
   ```bash
   codex --model o4-mini run "command"
   ```

2. **`codex.json` での設定**:
   ```json
   {
     "model": "codex-mini-latest",
     "policy": "suggest"
   }
   ```

## 詳細なデバッグ方法

### 診断情報の表示

問題のトラブルシューティングには、`doctor` コマンドが役立ちます：

```bash
OPENAI_API_KEY=your_api_key_here codex doctor
```

これにより、Codex CLIの環境設定と問題点が表示されます。

### ログの有効化

詳細なログを有効にするには、環境変数 `DEBUG` を設定します：

```bash
DEBUG=codex:* OPENAI_API_KEY=your_api_key_here codex run "command"
```

### APIキーのテスト

APIキーが正しく機能しているか確認するには：

```bash
curl -s https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY" | jq
```

正常な応答があれば、APIキーは有効です。

## GitHub Actionsでの非対話的実行

GitHub Actionsなどの非対話的環境では、以下の方法が推奨されます：

1. **環境変数を事前に設定**:
   ```yaml
   - name: Set environment
     run: echo "OPENAI_API_KEY=${{ secrets.OPENAI_API_KEY }}" >> $GITHUB_ENV
   ```

2. **`--yes` フラグを使用**:
   ```yaml
   - name: Run Codex
     run: codex run --yes --auto "command"
   ```

3. **認証ファイルの生成**:
   ```yaml
   - name: Setup auth
     run: |
       mkdir -p ~/.config/openai
       echo '{"api_key":"'${{ secrets.OPENAI_API_KEY }}'"}' > ~/.config/openai/auth.json
   ```

## よくある質問

### Q: Codex CLIのキャッシュをクリアするには？

A: キャッシュディレクトリを削除します:
```bash
rm -rf ~/.cache/openai-codex
```

### Q: 異なるOpenAIアカウント間で切り替えるには？

A: 環境変数を使い分けるか、明示的に認証します:
```bash
OPENAI_API_KEY=new_key codex auth
```

### Q: CI/CD環境でCodex CLIを使う最善の方法は？

A: 以下の原則を守ってください:
1. APIキーを安全なシークレットとして保存
2. 対話モードを回避するため、`--yes`フラグを使用
3. 明示的にタイムアウト設定を指定（`--timeout 600`など）

## 参考リンク

- [OpenAI API ドキュメント](https://platform.openai.com/docs/api-reference)
- [GitHub Actions シークレット管理](https://docs.github.com/ja/actions/security-guides/encrypted-secrets)