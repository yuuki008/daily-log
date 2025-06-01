This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Daily Log

## Supabase のセットアップ

このアプリケーションを動作させるには、Supabase でデータベースをセットアップする必要があります。

### 1. テーブルの作成

Supabase ダッシュボードの「SQL Editor」で以下のマイグレーションファイルを順番に実行してください：

1. **profiles テーブルの作成**

   - `supabase/migrations/01_create_profiles_table.sql` の内容をコピーして実行

2. **posts テーブルの作成**
   - `supabase/migrations/02_create_posts_table.sql` の内容をコピーして実行

### 2. サンプルデータの追加（オプション）

開発環境でテストする場合は：

1. Supabase ダッシュボードでユーザーを作成またはサインアップ
2. 「Authentication」→「Users」でユーザー ID を確認
3. `supabase/migrations/03_insert_sample_posts.sql` を開く
4. `YOUR_USER_ID_HERE` を実際のユーザー ID に置き換える
5. コメントを外して SQL Editor で実行

### 3. ストレージの設定（画像アップロード機能を使う場合）

画像をアップロードする場合は、Supabase のストレージバケットを作成してください：

1. Supabase ダッシュボードで「Storage」セクションに移動
2. 新しいバケット「posts-images」を作成
3. バケットのポリシーを設定（公開読み取りを許可）

## 機能

- タイムライン形式での投稿表示
- 無限スクロールによる過去の投稿の読み込み
- 複数画像のカルーセル表示
- レスポンシブデザイン
