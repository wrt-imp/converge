# Converge Web

Converge 教育多智能体项目的独立官网与学习工作台前端，使用 **React 18 + TypeScript + Docusaurus 3**。保留黑色、蓝色与紫色视觉、粒子动效和四幕学习机制演示，覆盖不同学科。

**仓库根目录就是 Web 工程，不需要进入 website/，不依赖后端源码、Python 或 Go。**

## 快速运行

需要 Node.js **22 LTS** 和 npm。

```bash
git clone https://github.com/wrt-imp/converge.git
cd converge
npm ci
npm start -- --host 127.0.0.1 --port 3000 --no-open
```

打开 <http://127.0.0.1:3000/>。保持终端运行；关闭进程后本地地址将无法访问。端口被占用时换端口，并使用终端实际输出的地址。

## 当前功能与边界

| 模块 | 当前实现 |
| --- | --- |
| 官网 | 首页、产品、架构、开发者、社区、下载、FAQ |
| 机制动画 | 四幕切换、进度、暂停/继续、上一幕/下一幕、重播及粒子 |
| 文档 | 快速开始、软件手册、MCP / Wiki / Memory / RAG / Skills 教程 |
| 学习工作台 | 三种学习模式、问题草稿；React 内存状态，刷新清空 |
| 资料库 | 本地选文件、文本预览与筛选；PDF/DOCX 仅元信息，不解析或上传 |
| 账号页面 | 导航仅登录；登录页可进入注册；表单校验与密码显隐 |
| 账号接口 | 仅预留；默认登录/注册提示服务未接入，不创建假用户或保存凭据 |
| 下载 | 安装包地址配置槽；目前无正式安装包，按钮禁用 |

**未接入模型问答、服务端检索、文件上传、历史同步或真实鉴权。** 软件教程中的桌面端能力，不代表已在 Web 工作台实现。注册只在未来注入的真实服务确认成功后跳转登录，目前不会模拟成功。

## 命令

| 命令 | 作用 |
| --- | --- |
| `npm ci` | 按锁文件安装，推荐用于克隆后及 CI |
| `npm install` | 常规安装；修改依赖时同步提交锁文件 |
| `npm start` | React 开发服务器 |
| `npm test` | 请求层、认证和注册流程回归测试 |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm run build` | 生产静态构建，输出 build/ |
| `npm run serve -- --host 127.0.0.1 --port 3004 --no-open` | 预览构建后的网站 |
| `npm run export:preview` | 构建并生成 preview/index.html |

生产预览需先 build。不要直接双击 build/index.html，它需要 HTTP 服务和完整资源目录。

## 单文件分享

执行 `npm run export:preview`，生成的 `preview/index.html` 可双击或发送给别人，包含内嵌样式、静态页面和动画/导航逻辑。

它是从 React 工程生成的离线展示副本，**不是 React 源码或完整业务运行环境**；账号与工作台表单禁用。修改后重新导出。生成文件不提交到源码仓库。

## 路由

| 路径 | 页面 |
| --- | --- |
| `/` | 官网首页 |
| `/learn` | 学习工作台 |
| `/resources` | 本地资料库 |
| `/docs` | 文档及侧边栏 |
| `/product` | 产品机制 |
| `/architecture` | 架构 |
| `/developers` | 开发者 |
| `/download` | 下载与安装 |
| `/faq` | 常见问题 |
| `/community` | 社区 |
| `/login` | 登录 |
| `/register` | 注册，从登录页进入 |

## 结构

```text
converge/
├─ docs/                        软件手册与教程
├─ integration/                 上游 API 契约快照，仅文档
├─ src/
│  ├─ components/               组件、图示、本地工作台状态
│  ├─ pages/                    React 页面及 CSS Modules
│  ├─ services/
│  │  ├─ api/                   统一 HTTP Client
│  │  ├─ auth/                  账号接口与未配置实现
│  │  └─ types/                 响应类型
│  ├─ theme/                    主题覆盖及 Provider
│  └─ css/                      全局样式与变量
├─ static/                      静态资源及下载目录
├─ tests/                       Node 测试与测试资料
├─ scripts/export-preview.mjs   单文件导出
├─ .github/workflows/ci.yml     检查与构建，不部署
├─ .env.example                 地址占位，不含密钥
├─ docusaurus.config.ts         站点、导航及页脚
├─ sidebars.ts                  文档侧边栏
├─ package.json
└─ package-lock.json
```

## API 与安全

见 [接口清单](FRONTEND_API.md) 和 [上游契约快照](integration/upstream-api-contract.md)。请求集中在 services。默认服务不联网，不伪造业务结果。

仅有登录、退出、当前用户的可选 HTTP 适配器；注册及其他 URL 待后端确认，禁止猜测。`.env.example` 的 API_BASE_URL 仅占位，**当前不会自动注入或启用后端**。集成时需要显式创建 `createHttpAuthService(createApiClient({baseUrl}))`、注入服务并实现会话管理。

远端 HTTPS、路径检查、禁止自动重定向、禁止隐式 Cookie 和请求缓存已落实；禁止把模型 Key、数据库凭据或共享密钥放进前端。前端不替代后端权限、限流与用户数据隔离。

## 验证与后续部署

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

仓库有 CI 检查，**没有自动发布流程**。配置中的 `https://converge.example.com` 是占位域名；后续部署前修改 url、核对 baseUrl 和静态路由规则。目前无需域名或后端即可预览。

已知：CSS 压缩可能提示 Missing font size，构建仍成功。测试是前端回归，不是远端联调或渗透测试。

开发前阅读 [设计规范](DESIGN-SYSTEM.md)、[组件说明](src/components/README.md)、[贡献说明](CONTRIBUTING.md)、[安全说明](SECURITY.md)。保留上游的 [MPL-2.0 许可证](LICENSE)。
