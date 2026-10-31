# Converge Web 设计与开发规范

保留已确认的黑色、蓝色、紫色配色、浮动粒子与四幕机制动画。机制演示使用低饱和浅紫底色和彩色图示，控制区位于黑色背景。不使用机器人、大脑、芯片等装饰；产品覆盖多学科，不以编程案例作为定位。

字体全部正体，大标题末尾不加句号。强调层级、图形和留白，避免重复卡片和长文。文档与辅助页面支持浅/暗主题，首页和账号页保留专属面板。

## 样式来源

- `src/css/custom.css`：变量、导航、主题与文档基础。
- `src/pages/index.module.css`：首页、粒子、机制动画。
- `src/pages/register.module.css`：登录与注册共享样式。
- `src/components/VisualSystem.module.css`：通用组件。

| 变量 | 默认值 |
| --- | --- |
| 背景 --site-bg / --paper | #f5f3ee / #fbfaf7 |
| 文字 --text-primary / --text-secondary | #171816 / #62635f |
| 边框 / 卡片 --border-subtle / --surface-subtle | #deddd6 / #eeece5 |
| 品牌 / hover | #7654d6 / #6342c1 |
| success / warning / error | #287557 / #9a620e / #b33a3a |
| 内容宽度 | 默认 1160px，宽版 1360px，阅读 760px |
| 桌面基础间距 | 页面 52px，section 132px，卡片间距 22px |

响应式及专属面板以 CSS Module 为准；暗色变量在 html[data-theme='dark'] 中。优先复用语义变量。

## 组件

| 组件 | 约束 |
| --- | --- |
| Container / Section | 管理宽度、留白、标题和锚点 |
| Button | 跳转用链接，动作用 button；保留 focus/disabled |
| Card / FeatureCard | 一个主题、简短标题与说明 |
| Screenshot | 真实截图；无截图时明确占位，提供替代说明 |
| Diagram | HTML/SVG 图示，保留可访问说明 |
| CTA | 一个主要动作，避免重复入口 |

Props 见 `src/components/README.md`。保留轮播暂停、切换、重播和减少动画适配；粒子不遮文字、不拦截点击。

## 完成标准

- 页面在 pages，共享组件在 components，请求集中 services，文档在 docs，资源在 static。
- 不引入本机绝对路径、上游源码依赖或未经确认的 endpoint；不随意增加依赖。
- 检查 375 / 768 / 1024 / 1440px，无横向溢出、变形或导航异常。
- 键盘可操作、焦点可见、表单标签/错误完整、图片有 alt、图示有说明。
- 检查暗色主题、对比度、减少动画、链接和文档导航。
- test / typecheck / lint / build 通过；未实际验证不能宣称通过。
