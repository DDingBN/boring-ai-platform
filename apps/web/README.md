# Web 应用开发指南

`apps/web` 是 Boring AI Platform 的 React 前端，使用 Vite、TypeScript、React Router 和 Ant
Design。本文面向需要启动、检查或扩展 Web 应用的开发者。

当前 Web 已实现基础布局、菜单、面包屑、首页、Mock Chat、登录占位页和错误页。它尚未配置
`/api` 代理、真实 API Client、鉴权或自动化测试。

## 1. 前置要求

请先按照仓库根目录的 [README](../../README.md) 安装 Node.js、pnpm 和全部 workspace 依赖。
不要在 `apps/web` 内单独执行 npm 或 yarn 安装。

## 2. 环境配置

Web 从仓库根目录 `.env` 读取配置：

| 变量       | 默认值      | 用途                    |
| ---------- | ----------- | ----------------------- |
| `WEB_HOST` | `127.0.0.1` | Vite 开发和预览监听地址 |
| `WEB_PORT` | `5173`      | Vite 开发服务端口       |

示例：

```dotenv
WEB_HOST=127.0.0.1
WEB_PORT=5173
```

只有允许暴露给浏览器的配置才能使用 `VITE_` 前缀。API Key、数据库 URL 等服务端配置禁止
添加 `VITE_` 前缀。

## 3. 启动 Web

建议在仓库根目录执行：

```bash
pnpm --filter @repo/web dev
```

默认访问地址为 `http://127.0.0.1:5173`。修改 `.env` 后需要重启 Vite。

如果需要同时运行 Server：

```bash
pnpm dev
```

## 4. 页面检查

| 路径                   | 当前行为                                      |
| ---------------------- | --------------------------------------------- |
| `/`                    | 重定向到 `/home`                              |
| `/home`                | 展示静态首页和 Mock 指标                      |
| `/chat`                | 浏览器本地状态驱动的 Mock Chat，不调用 Server |
| `/login`               | 登录表单占位，不提交认证请求                  |
| `/403`、`/404`、`/500` | 错误占位页                                    |
| 其他路径               | 展示 404 页面                                 |

启动后至少检查首页、Chat 页面、侧栏折叠和一个不存在的路径。

## 5. 常用命令

在仓库根目录执行：

| 命令                                | 用途                     |
| ----------------------------------- | ------------------------ |
| `pnpm --filter @repo/web dev`       | 启动 Vite 开发服务       |
| `pnpm --filter @repo/web lint`      | 检查 Web 代码规范        |
| `pnpm --filter @repo/web typecheck` | 检查 Web TypeScript 类型 |
| `pnpm --filter @repo/web build`     | 生成生产构建             |
| `pnpm --filter @repo/web preview`   | 本地预览生产构建         |

Web 当前没有独立 `test` 脚本。新增 API 状态、复杂表单或关键交互时，应在对应业务阶段引入测试，
而不是等到项目末期统一补齐。

## 6. 目录结构

```text
apps/web/
  public/                 静态资源
  src/
    components/layouts/   主布局、侧栏、菜单、Header 和 Footer
    data/                 菜单数据、路由元数据和页面注册表
    pages/                home、chat、login、error 页面
    router/               React Router 配置
    App.tsx               RouterProvider 入口
    main.tsx              React DOM 入口
  vite.config.ts          环境加载和 Vite 服务配置
```

菜单数据和页面组件是分开维护的：

- `src/data/menuData.ts` 决定菜单项、路径和层级。
- `src/data/routeRegistry.tsx` 把菜单路径映射到 React 页面组件。
- `src/router/routes.tsx` 生成菜单路由，并维护登录页和错误页等静态路由。

## 7. 新增页面

新增一个需要出现在侧栏的页面时：

1. 在 `src/pages/<feature>/` 创建页面组件和样式。
2. 在 `src/data/menuData.ts` 添加菜单项和路径。
3. 在 `src/data/routeRegistry.tsx` 注册路径与组件的映射。
4. 运行 Lint、类型检查和构建。
5. 在浏览器验证直接访问、菜单选中状态和面包屑。

只需要路由、不需要菜单的页面，应直接在 `src/router/routes.tsx` 中注册，避免为隐藏页面创建假菜单。

当前 `requiredPermissions` 只用于菜单过滤，不构成真正的路由权限保护。鉴权接入前不要把它当成
安全边界。

## 8. 接入 Server API

目前 Web 和 Server 尚未连通。开始真实业务接口时，建议同时完成：

1. 在 `vite.config.ts` 中配置本地 `/api` 代理。
2. 创建 `src/api/`，集中处理基础 URL、JSON、错误响应和 requestId。
3. 从 `@repo/shared` 复用请求/响应契约。
4. 页面只调用 API 函数，不散落重复的 `fetch()` 和错误解析逻辑。
5. 为成功、校验失败、Server 错误和加载状态添加测试。

不要在前端代码中读取 `DEEPSEEK_API_KEY`、`DATABASE_URL` 或其他服务端秘密。

## 9. 构建和预览

```bash
pnpm --filter @repo/web build
pnpm --filter @repo/web preview
```

构建产物位于 `apps/web/dist`。Preview 地址以终端输出为准，默认端口通常为 `4173`。

当前构建会提示主 JavaScript chunk 超过 Vite 默认建议值。现阶段不影响运行；随着业务页面增加，
应优先使用路由懒加载拆分页面代码，而不是简单调高警告阈值。

## 10. 常见问题

### 菜单出现，但页面显示 404

检查对应路径是否已在 `src/data/routeRegistry.tsx` 注册，且路径与 `menuData.ts` 完全一致。

### 页面可以打开，但 `/api` 请求返回 404

当前没有 Vite `/api` 代理，这是尚未实现的业务基础能力。确认 Server 接口和代理均已注册后再进行
联调。

### 修改 `.env` 后配置没有变化

停止并重新启动 Vite。环境变量在开发服务启动时加载。

### 构建失败

依次运行：

```bash
pnpm --filter @repo/web lint
pnpm --filter @repo/web typecheck
pnpm --filter @repo/web build
```

根据第一个失败命令修复问题，不要直接删除 lockfile 或重新生成全部依赖。

## 11. 相关文档

- [根目录开发指南](../../README.md)
- [当前实现状态](../../docs/current-status.md)
- [Web 模块设计](../../docs/modules/web.md)
- [接口设计规范](../../docs/api/interface-design-spec.md)
