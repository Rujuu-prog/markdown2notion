# 📖 開発手引き

## 🛠 環境構築
1. **パッケージのインストール** 📦
```bash
yarn install
```
2. **テストの実行** ✅
```bash
yarn test
```

## 🔍 API経由でのテスト
1. **.env ファイルの作成** 📝
```bash
cp .env.example .env
```
2. **.env ファイルに Notion の Token と Database ID を入力** 🔑
3. `__tests__/testMarkdownToNotion.ts`を実行  🚀
```bash
yarn test:api
```

## 🎯 補足
- .env を適切に設定しないと yarn test:api でエラーになるので注意！ ⚠️
- sample/docs ディレクトリが存在することを確認してね ✅

## 🎉 開発環境の準備は完了！ Happy Coding! 💻🔥