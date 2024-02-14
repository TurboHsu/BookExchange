# BookExchange

[![codecov](https://codecov.io/github/BeiyanYunyi/BookExchange/graph/badge.svg?token=B2BEW8XB25)](https://codecov.io/github/BeiyanYunyi/BookExchange)

南京信息工程大学易书活动网站源代码

## Usage

```bash
corepack enable
pnpm i
pnpm dev
```

## Environment for backend

```js
export const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
export const jwtSecret = process.env.JWT_SECRETS!;
```
