# 独立仓库验证记录

日期：2026-10-31。环境：Windows、Node.js v24.16.0、npm 11.13.0。CI 使用 Node.js 22，与本地验证分开记录。

| 检查 | 结果 |
| --- | --- |
| 独立目录 npm ci --no-audit --no-fund | 通过，安装 1337 个包 |
| npm test | 16 项通过 |
| npm run typecheck | 通过 |
| npm run lint | 通过 |
| npm run export:preview | Build 通过，生成 26 页离线 HTML，约 619 KB |
| 主要路由产物 | 首页、learn、resources、docs、product、architecture、developers、download、faq、community、login、register 均存在 |
| 官网源码完整性 | src/docs/static/tests/scripts 无遗漏文件 |
| 首页样式与原官网比较 | SHA256 一致，保留既有动画与色彩 |
| git diff --cached --check | 通过 |

现有 CSS 压缩会提示 Missing font size，不阻断构建。Docusaurus 更新检查可能因本机配置目录权限失败，不影响构建。

本记录不代表已部署，也不代表真实后端已通过验证。账号默认未配置；模型、上传、检索和历史同步未联网。CI 的实际结论以仓库 Actions 对应提交结果为准。此次迁移未重新进行完整浏览器响应式和无障碍审计。
