# Web 前端接口交接

本工程仅负责 React Web。`src/services/` 是浏览器请求适配层，不是后端实现；没有服务器、数据库、密码校验或模型执行代码。本页取代后台实现交接文档。

## 当前实际预留的接口

以下路径来自已有 API 文档，不是自行猜测。页面目前未启用真实请求；导航仅显示 `/login` 登录入口，注册入口位于登录页内。注册接口成功返回后才跳转到登录页；默认未配置实现不会模拟成功。注册接口没有已确认 URL，不发送或保存凭据。

| 前端方法 | HTTP | 路径 | 前端发送 | 期望返回 | 认证 |
| --- | --- | --- | --- | --- | --- |
| login | POST | `/api/auth/login` | JSON `{username, password}` | `{token, expiresAt, user}` | 无 |
| logout | POST | `/api/auth/logout` | 无请求体 | `{status:"ok"}` | `Authorization: Bearer <token>` |
| getCurrentUser | GET | `/api/auth/me` | 无请求体 | `{user, sessionRemainingSeconds}` | 同上 |

`user`：`{id:number, username:string, role:string, displayName:string}`。

失败响应：`{error:{code:string,message:string}}`。传输层非成功响应抛出 ApiClientError（包含 HTTP status 与结构化错误）。网络异常和取消由调用方处理。

不增加 refreshToken、注册、忘记密码等未经约定的 HTTP endpoint。注册页只有 `RegistrationService.register` 前端扩展接口，URL 和响应协议仍待确认。

## 尚未预留业务 URL 的能力

| 功能 | 当前 Web 行为 | 接口状态 |
| --- | --- | --- |
| 教育对话 | 保存当前标签页学习草稿，不发送模型请求 | 待后端确定，不编造 URL |
| 资料上传 | 浏览器本地选文件，不上传 | 待后端确定 |
| 文本预览/筛选 | 浏览器本地处理，无服务器依赖 | 不需要后端接口 |
| RAG / 引用 / 历史同步 | 未接入，不生成模拟回答 | 待后端确定 |
| Skills | 仅保留已有文档的响应类型 | 未创建请求服务或页面调用 |

## 接口代码位置

```text
src/services/
├─ index.ts                     统一导出
├─ api/
│  ├─ index.ts
│  └─ client.ts                 request/get/post/put/delete 与错误处理
├─ auth/
│  ├─ auth-service.ts           类型、默认未配置实现、可选 HTTP adapter
│  ├─ registration-service.ts   注册预留方法、成功后继续的回调
│  └─ README.md
└─ types/
   ├─ index.ts
   ├─ api.ts                    通用错误与健康检查响应类型
   └─ skills.ts                 已有 Skills 响应类型，不代表已接入
```

核心接口定义（完整实现直接使用 `src/services/auth/auth-service.ts`）：

```typescript
export interface LoginInput {username: string; password: string}
export interface AuthUser {
  id: number;
  username: string;
  role: string;
  displayName: string;
}
export interface LoginResult {
  token: string;
  expiresAt: string;
  user: AuthUser;
}
export interface CurrentUserResult {
  user: AuthUser;
  sessionRemainingSeconds: number;
}
export interface AuthService {
  login(input: LoginInput, signal?: AbortSignal): Promise<LoginResult>;
  logout(token: string, signal?: AbortSignal): Promise<void>;
  getCurrentUser(token: string, signal?: AbortSignal): Promise<CurrentUserResult>;
}
```

默认导出 `authService` 的三个方法均抛出 AuthNotConfiguredError：不请求接口、不创建假用户、不保存密码/token。

后端就绪后由集成方显式调用 `createHttpAuthService(createApiClient({baseUrl}))`，其内部会校验返回格式。baseUrl 必须由团队确认；本文件不提供真实服务器地址和密钥。

本仓库根目录即独立 Web 工程，不含后端实现或桌面运行环境。Web 保留原有配色与动画。后端契约快照位于 `integration/upstream-api-contract.md`，源自 Multi-Agent 的 `server/docs/api.md`，仅作接口交接依据。

## 完整边界核对（2026-10-31）

### 预留的前端方法

| 方法/配置 | 输入 | 输出/作用 | 代码 |
| --- | --- | --- | --- |
| `AuthService.login` | `{username, password}` + 可选 AbortSignal | `LoginResult`，当前默认拒绝 | `src/services/auth/auth-service.ts` |
| `AuthService.logout` | token + 可选 AbortSignal | `void`，当前默认拒绝 | 同上 |
| `AuthService.getCurrentUser` | token + 可选 AbortSignal | `CurrentUserResult`，当前默认拒绝 | 同上 |
| `RegistrationService.register` | `{username, password}` + 可选 AbortSignal | `Promise<void>`；仅是暂定前端签名，当前默认拒绝 | `src/services/auth/registration-service.ts` |
| `registerAndContinue` | service、注册输入、成功回调、可选 signal | 服务成功后执行回调；失败不跳转 | 同上 |
| `ApiClient.request/get/post/put/delete` | 站内 path、JSON body、headers、signal | 泛型 JSON 返回值；不会自动创建业务 URL | `src/services/api/client.ts` |
| `installerPackage` | version/platform/downloadUrl（当前 URL 为 null） | 下载链接配置槽，不是 HTTP API | `src/pages/download.tsx` |
| `API_BASE_URL` | 后端确认的地址 | `.env.example` 仅占位，当前未自动注入或读取 | `.env.example` |

注册不发送确认密码；确认密码仅用于页面一致性检查。登录和注册密码保存在组件内存中，提交结束后清空，不写浏览器 storage、日志或 URL。当前未实现真实登录成功后的会话管理。

### 项目 API 文档中存在、官网尚未接入的端点

以下仅核对 `integration/upstream-api-contract.md` 的契约存在性，不代表本次验证了后端运行。

| HTTP / 路径 | 用途 | 官网状态 |
| --- | --- | --- |
| `GET /api/skills` | Skills 列表；category/audience/page/size | 仅有响应类型，无请求服务 |
| `GET /api/skills/{code}` | Skill 详情 | 仅有响应类型，无请求服务 |
| `POST /mcp` | MCP 标准协议 | 官网无调用适配器 |
| `GET /healthz` | 健康检查 | 仅有响应类型，官网不请求 |

其他主项目内部/桌面接口不属于当前官网对接范围。页面路由 `/login`、`/register`、`/learn`、`/resources`、`/docs` 等是前端页面地址，不是后端 API。

## 前端安全审查

已落实：

- API 调用集中在 services；页面无直接 fetch、XHR、WebSocket 或模型请求。
- 非本机服务器地址要求 HTTPS；禁止 URL 内用户名、密码、查询参数及片段。只允许单 `/` 开头的 path，拒绝外部 URL、反斜杠、控制字符、目录跳转。
- 请求显式使用 `credentials: 'omit'`、`redirect: 'error'`、`cache: 'no-store'`、`referrerPolicy: 'no-referrer'`。当前契约采用显式 Bearer token，不隐式携带 Cookie。
- Bearer token 拒绝空值、空格、控制字符、非 ASCII 及超长值；登录输入限制与表单一致（用户名 64、密码 256），密码不 trim。
- 认证响应校验 user、token、日期、会话剩余时间；失败不产生假用户。普通泛型 API Client 的类型参数并非运行时业务校验，未来业务 service 必须单独校验。
- 页面显示通用错误，避免将原始后端错误、堆栈或凭据暴露给用户；未写真实密钥。前端环境变量均应视作公开信息。
- 默认服务不发送网络请求；安装包 URL 未配置，因此不会下载未知文件。

自动化证据：`tests/api-client.test.mjs`、`tests/auth-service.test.mjs`、`tests/registration-service.test.mjs`。这些使用注入的测试实现，不是远端联调。

接真实后端前必须验证（本次未实现后端、未验证真实服务）：

- 服务端独立校验所有输入、token 和资源归属；前端隐藏按钮不构成权限保护。
- HTTPS、精确 CORS 来源白名单、登录限流、防枚举、密码安全哈希、会话过期/撤销与日志脱敏。文档描述不等于实测通过。
- 当前 Bearer 契约下不要把 token 写 localStorage；后续会话存储和登录成功处理需要单独设计。若改成 Cookie，需重新设计 HttpOnly/Secure/SameSite、CSRF 保护并调整客户端 credentials。
- 部署层配置 CSP、frame-ancestors、HSTS、nosniff 和认证响应 Cache-Control；客户端 no-store 不代替服务端响应头。
- 调用方可传 AbortSignal 取消请求，当前未内置默认超时、重试或自动刷新；接入时明确超时和 401/429 处理，不盲目重试注册等写请求。
- 下载正式开放前确认 HTTPS 来源、平台、版本、签名和校验和；资料上传前落实服务端大小/格式/内容检查与用户隔离。

不能承诺“所有接口绝对安全”：当前确认的是前端代码边界及回归测试，真实后端与部署安全仍待独立验收。
