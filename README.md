# 郵遞區號查詢

這是一個使用 Next.js 和 styled-components 建立的郵遞區號查詢網站。

## 功能特點

- 🔍 即時搜尋建議
- 📱 響應式設計
- 🌐 多語系支援
- 📷 拍照辨識（開發中）
- 🎤 語音輸入（開發中）
- 📋 一鍵複製
- 🔒 隱私權政策

## 技術棧

- Next.js
- React
- TypeScript
- Styled Components
- Jest
- ESLint
- Prettier
- Husky

## 開發環境設定

1. 安裝依賴：
   ```bash
   npm install
   ```

2. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

3. 執行測試：
   ```bash
   npm test
   ```

4. 檢查程式碼：
   ```bash
   npm run lint
   ```

5. 格式化程式碼：
   ```bash
   npm run format
   ```

## 環境變數

建立 `.env.local` 檔案並設定以下變數：

```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

## 專案結構

```
src/
  ├── components/     # React 元件
  ├── pages/         # Next.js 頁面
  ├── services/      # API 服務
  ├── styles/        # 全域樣式
  └── types/         # TypeScript 型別定義
```

## 貢獻指南

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 授權

MIT 