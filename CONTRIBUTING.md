# 贡献与维护

1. 使用 Node.js 22，执行 npm ci。
2. 从最新 main 创建工作分支，小步修改页面、服务层或文档。
3. 保留配色与动画，先读 [设计规范](DESIGN-SYSTEM.md)。
4. 请求集中 services；未知接口不猜测，不假造业务成功。
5. 区分桌面产品能力和 Web 已实现能力。
6. 执行 npm test、npm run typecheck、npm run lint、npm run build，检查相关响应式和键盘交互。
7. 提交源码、文档、测试及锁文件；不提交环境密钥、依赖、构建产物或用户数据。

说明问题、最终行为和实际验证。接口变化同步 FRONTEND_API.md，离线预览需要重新导出。
