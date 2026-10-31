# 登录接口预留

导航仅显示 `/login` 登录入口。登录页链接到 `/register`，注册页提供返回登录的链接。原 `authService` 接口保留，所有默认调用明确拒绝，不请求后端、不保存密码或令牌、不生成 Mock 用户。

注册页使用 `registration-service.ts` 的未配置接口；没有真实注册 endpoint 或请求。确认密码仅用于前端一致性检查，不传给服务。只有接口成功返回才跳转到 `/login?registered=1`；未配置或失败时留在注册页，不显示虚假成功，不把用户名或密码放进 URL。

`AuthService` 包含 login、logout、getCurrentUser。`createHttpAuthService(client)` 是后续显式启用的适配器，仅遵循 `integration/upstream-api-contract.md` 已有的三个路由；页面目前没有创建或调用它。没有已文档化的刷新接口，因此不添加 refreshToken。

接入前应由团队确认 API_BASE_URL、HTTPS、令牌的安全管理和身份过期策略。不得把共享服务器访问密钥或上游模型 Key 放进前端；不得将密码或令牌写入日志。传输错误由调用方按 401/429/503 等处理。

本轮测试使用注入的假传输，既不连真实服务，也不证明服务器可用。执行 `npm test`。
