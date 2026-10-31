# Converge 服务器 HTTP API 契约

> 本文件是从上游 Multi-Agent 的 `server/docs/api.md` 复制的接口契约快照，仅供前端交接。它不是本仓库的后端实现或可用性证明。官网当前状态和安全约束以根目录 `FRONTEND_API.md` 为准；下文原有的 token 持久化建议未被官网采用。

> 给客户端开发同学（GPT 对接）的接口文档。服务器地址示例 `https://your-domain.example.com`（nginx TLS 终结后转发）。
> 所有响应为 JSON。错误统一格式：`{"error":{"code":"...","message":"..."}}`。

## 通用约定

- **认证**：登录成功后拿到 `token`，后续所有受保护请求携带请求头：
  `Authorization: Bearer <token>`
- **防枚举行为**：未携带有效 token 访问任何 `/api/*` 或 `/mcp` 路径，一律返回 `401`（包括不存在的路径）。请勿据此探测路由。
- **限流**：登录接口按 IP 限流（20 次/分钟）；受保护接口按 token 限流（默认 120 次/分钟），超限返回 `429`。
- **请求体上限**：1MB。JSON 严格解析。
- **账号锁定**：密码连续错 5 次锁定 15 分钟，期间登录返回 `429 account_locked`（message 与普通失败一致）。

## 端点

### 1. 登录 `POST /api/auth/login`（无需认证）

请求：
```json
{"username": "student01", "password": "your-password"}
```

成功（200）：
```json
{
  "token": "opaque-token-string",
  "expiresAt": "2025-03-02T12:00:00+08:00",
  "user": {"id": 1, "username": "student01", "role": "student", "displayName": "小明"}
}
```

失败：
| 状态 | code | 场景 |
|---|---|---|
| 401 | invalid_credentials | 用户名或密码错误（含账号不存在/被禁用，统一提示） |
| 429 | account_locked | 连续失败过多，账号被锁定 |
| 429 | rate_limited | 该 IP 登录太频繁 |
| 503 | service_unavailable | 认证服务（Redis）不可用 |

### 2. 登出 `POST /api/auth/logout`（需认证）

成功（200）：`{"status":"ok"}`。登出后原 token 立即失效。

### 3. 当前用户 `GET /api/auth/me`（需认证）

成功（200）：
```json
{
  "user": {"id": 1, "username": "student01", "role": "student", "displayName": "小明"},
  "sessionRemainingSeconds": 86123
}
```
客户端可用 `sessionRemainingSeconds` 提示会话剩余时间；过期需重新登录。

### 4. Skill 列表 `GET /api/skills`（需认证）

查询参数：`category`（可选）、`audience`（可选：student/teacher/both）、`page`（默认 1）、`size`（默认 50，最大 200）。

成功（200）：
```json
{
  "items": [
    {
      "code": "socratic-questioning",
      "name": "苏格拉底式问答",
      "category": "study",
      "audience": "student",
      "description": "以提问引导思考……",
      "version": 1,
      "updatedAt": "2025-03-02T10:00:00+08:00"
    }
  ],
  "page": 1,
  "size": 50,
  "total": 200
}
```

### 5. Skill 详情 `GET /api/skills/{code}`（需认证）

成功（200）：
```json
{
  "code": "socratic-questioning",
  "name": "苏格拉底式问答",
  "category": "study",
  "audience": "student",
  "description": "……",
  "instructions": "# 苏格拉底式问答\n\n## 适用场景\n……（完整 Markdown 正文）",
  "version": 1,
  "updatedAt": "2025-03-02T10:00:00+08:00"
}
```

不存在（404）：`{"error":{"code":"not_found","message":"skill 不存在"}}`

### 6. MCP 端点 `POST /mcp`（需认证，Bearer 同款）

MCP Streamable HTTP 标准端点（Model Context Protocol，官方 SDK 实现）。
MCP 客户端配置时填入：URL = `https://your-domain.example.com/mcp`，Header `Authorization: Bearer <token>`。

#### MCP 工具清单（v0.1）

| 工具 | 说明 |
|---|---|
| `math.evaluate` | 安全计算数学表达式（+ - * / ^ %、括号、sin/cos/tan/sqrt/log/pow/min/max 等函数，默认角度制） |
| `math.unit_convert` | 单位换算：长度/质量/面积/体积/速度/时间/温度（含 里/斤/亩/摄氏度 等中文单位） |
| `formula.lookup` | 中小学数理化公式库查询（约 80 条：公式、含义、学段） |
| `idiom.lookup` | 成语查询（80 个常用成语：拼音、释义、出处、例句） |
| `poetry.lookup` | 中小学必背古诗词查询（50 首：作者、朝代、全文、名句、主题） |
| `learning.method` | 经典学习方法查询/推荐（12 种：费曼、番茄、间隔重复、SQ3R 等） |
| `study.plan` | 按艾宾浩斯遗忘曲线生成学习计划（科目+目标+天数+每日分钟） |

#### curl 调试示例

```bash
# 列出全部工具
curl -H 'Authorization: Bearer <token>' -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' \
  https://your-domain.example.com/mcp

# 调用工具
curl -H 'Authorization: Bearer <token>' -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"math.evaluate","arguments":{"expression":"sqrt(144)+sin(30)"}}}' \
  https://your-domain.example.com/mcp
```

### 7. 健康检查 `GET /healthz`（无需认证）

成功（200）：`{"status":"ok"}`。仅供 nginx/监控使用。

## 客户端接入建议

1. 登录后持久化 `token` 与 `expiresAt`，请求前检查过期；收到 `401` 时引导重新登录。
2. 所有请求设置合理超时（建议 30s）；MCP 流式调用可能长达数分钟。
3. 不要在客户端保存密码；错误提示统一显示「用户名或密码错误」。
4. 会话固定 24 小时过期，服务器端随时可撤销（改密/禁用会踢掉全部会话）。
