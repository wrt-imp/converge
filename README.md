# Converge 官网

Converge 是面向编程教育的教学认知状态引擎。本仓库包含官网、产品介绍页面，以及基于 Docusaurus 的软件手册与使用教程。视觉表达围绕教育场景、学习过程和产品工作流展开，不把产品包装成通用聊天机器人。

## 功能与页面

| 路径 | 内容 |
| --- | --- |
| `/` | 官网首页：产品定位、教学认知模型、能力与系统关系图 |
| `/product` | 产品介绍 |
| `/docs` | 文档入口、软件手册和教程 |
| `/docs/getting-started/quick-start` | 快速开始 |
| `/docs/manual/software-manual` | 软件手册 |
| `/docs/tutorials/use-mcp` | MCP 教程 |
| `/docs/tutorials/use-wiki` | Wiki 教程 |
| `/docs/tutorials/use-memory` | Memory 教程 |
| `/docs/tutorials/use-rag` | RAG 教程 |
| `/download` | 下载页 |
| `/faq` | 常见问题 |

目前不提供登录入口；官网没有实现真实账号系统或真实鉴权。服务层为后续 API 对接预留，不应将示例地址或 Mock 当作线上后端。

## 技术栈

- React 18、TypeScript 5
- Docusaurus 3
- CSS Modules 与全局 CSS
- ESLint 9

依赖保持克制，除 Docusaurus 生态、React 和必要的 lint/type 工具外，不额外引入 UI 框架。

## 本地运行

要求 Node.js 20 或更高版本。

```bash
npm ci
npm run start
```

开发服务器默认地址为 `http://localhost:3000`。Docusaurus 支持页面热更新；编辑 `docs/` 中的 Markdown/MDX 文件即可更新文档。

## 检查与生产构建

```bash
npm run typecheck
npm run lint
npm run build
npm run serve
```

`npm run build` 生成可部署的静态站点到 `build/`；使用 `npm run serve` 可在本地预览生产构建。

## API 环境配置

复制 `.env.example` 为 `.env`，按环境设置：

```dotenv
API_BASE_URL=https://api.example.com
API_MOCK=false
API_DEBUG=false
```

- `API_BASE_URL` 必须是后端提供的公开 HTTP(S) 基础地址；`api.example.com` 仅为示例，不能直接作为生产地址。
- `API_MOCK=true` 用于本地或测试时选择 Mock 服务。线上环境应根据实际集成情况配置，不能依赖 Mock 作为业务后端。
- `API_DEBUG` 仅在开发环境启用安全的请求/响应诊断信息。
- 不要将密钥、令牌或其他私密凭据放入 `API_BASE_URL` 或任何会进入浏览器构建产物的变量。此站点的配置是公开前端配置。
- 后端需配置允许官网来源的 CORS。官网未绑定未经确认的业务 endpoint；具体 endpoint、请求类型和响应结构应以正式 API 文档为准。

## 在线官网与部署

本仓库针对 GitHub Pages 项目站点配置，官网地址为 [https://wrt-imp.github.io/converge/](https://wrt-imp.github.io/converge/)。推送到 `main` 会通过 `.github/workflows/deploy-pages.yml` 自动检查并构建站点，然后发布 `build/`。首次发布前，请在 GitHub 仓库的 **Settings → Pages → Build and deployment** 中将 **Source** 设为 **GitHub Actions**。后续每次推送到 `main` 都会触发部署。

站点基址在 `docusaurus.config.ts` 中配置为 `https://wrt-imp.github.io/converge/`。如更改 GitHub 用户名、仓库名或改用自定义域名，需同步修改 `url` 和 `baseUrl`。也可在其他静态托管平台部署：

```bash
npm ci
npm run typecheck
npm run lint
npm run build
```

若接入后端 API，还需同步配置生产 `API_BASE_URL` 与后端 CORS。API 地址属于公开前端配置，不要在其中放置私密密钥。

## 目录结构

```text
.
├─ docs/                    # 快速开始、手册、教程、概念、排错与 FAQ
├─ src/
│  ├─ components/           # 页面组件与图形化内容
│  ├─ pages/                # 首页、产品、下载、FAQ 等页面
│  ├─ services/             # API Client、Auth/Skills 服务、类型与 Mock
│  ├─ theme/                # Docusaurus 主题说明/覆盖
│  └─ css/                  # 全局样式与设计变量
├─ static/                  # 官网图像和静态资源
├─ tests/                   # 官网相关测试
├─ docusaurus.config.ts
├─ sidebars.ts
├─ DESIGN-SYSTEM.md         # 视觉、排版、组件和验收规范
└─ package.json
```

## 文档导航

- [快速开始](docs/getting-started/quick-start.md)
- [第一次启动](docs/getting-started/first-launch.md)
- [软件手册](docs/manual/software-manual.md)
- [配置模型](docs/manual/model-configuration.md)
- [使用 MCP](docs/tutorials/use-mcp.md)
- [使用 Wiki](docs/tutorials/use-wiki.md)
- [使用 Memory](docs/tutorials/use-memory.md)
- [使用 RAG](docs/tutorials/use-rag.md)
- [使用 Skills](docs/tutorials/use-skills.md)
- [常见错误](docs/troubleshooting/common-errors.md)
- [FAQ](docs/troubleshooting/faq.md)
- [官网设计规范](DESIGN-SYSTEM.md)

## 设计与内容原则

以白色界面、清晰层级和充足留白为主；优先用真实产品截图、流程图、架构关系和数据图示解释功能。避免虚构产品能力、无依据的宣传文案和过度装饰。更完整的设计变量、组件规范和页面验收标准见 [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md)。

## 贡献说明

修改页面或教程时，请先核对仓库现有产品资料，不推测尚未确认的功能或 API。页面调整需考虑移动端、键盘操作、焦点可见性、亮/暗色模式，并至少通过 TypeScript、ESLint 和生产构建检查。新增依赖前说明必要性，并优先使用现有工具链。
