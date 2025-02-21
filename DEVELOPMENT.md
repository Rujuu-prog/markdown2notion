# 📖 Development Guide

## 🛠 Setting Up the Environment
1. **Install dependencies** 📦
```bash
yarn install
```
2. **Run tests ** ✅
```bash
yarn test
```

## 🔍 Testing via API
1. **Create a .env file** 📝
```bash
cp .env.example .env
```
2. **Add Notion Token and Database ID to the .env file** 🔑
3. Run`__tests__/testMarkdownToNotion.ts`  🚀
```bash
yarn test:api
```

## 🎯 Notes
- Make sure .env is properly configured; otherwise, yarn test:api may fail!  ⚠️
- Ensure that the sample/docs directory exists ✅

## 🎉 The setup is complete! Happy Coding! 💻🔥