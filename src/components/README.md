# 通用视觉组件

本目录提供 Converge 官网的基础视觉语言。组件不包含业务数据，不发起网络请求，也不绑定后端路由。页面负责内容编排，组件负责一致的结构、状态和响应式表现。

统一从入口文件导入：

```tsx
import {
  Button,
  Card,
  Container,
  CTA,
  Diagram,
  FeatureCard,
  Screenshot,
  Section,
} from '../components';
```

## Container

控制页面最大宽度和响应式水平留白。不要在页面中重复编写宽度计算。

```tsx
<Container>默认 1120px 内容区</Container>
<Container size="narrow">适合长文阅读的窄内容区</Container>
<Container size="wide">适合产品结构图的宽内容区</Container>
```

支持 `narrow`、`default`、`wide` 三种尺寸，并接受标准 `div` 属性与 `className`。

## Section

负责页面纵向节奏、标题层级和 Section 与标题的可访问关联。

```tsx
<Section
  eyebrow="学习闭环"
  title="让每次教学动作都有证据"
  intro="将观察、诊断、干预和复盘组织为可追踪的学习过程。"
  tone="subtle"
>
  <Diagram title="教学认知状态更新流程">...</Diagram>
</Section>
```

- `tone`：`default`、`subtle`、`ruled`。
- `spacing`：`default`、`compact`。
- `align`：`left`、`center`。
- 可通过 `action` 放置一个与本区块相关的操作。

## Button

同时支持原生按钮和 Docusaurus 前端路由链接。

```tsx
<Button to="/docs">阅读文档</Button>
<Button variant="secondary" to="/download">查看下载</Button>
<Button variant="text" icon={<ArrowIcon />} iconPosition="end">了解能力</Button>
<Button type="submit" isLoading loadingLabel="正在保存">保存</Button>
```

- `variant`：`primary`、`secondary`、`text`、`danger`。
- `size`：`small`、`medium`、`large`。
- `isLoading` 会阻止重复操作并提供 `aria-busy`。
- 图标只作辅助表达，纯图标按钮仍需提供 `aria-label`。
- 单个区块通常只使用一个 `primary` 按钮。

## Card

用于组织一组相关内容，不应把每段文字都放进卡片。

```tsx
<Card variant="bordered" padding="medium">
  <h3>学习证据</h3>
  <p>记录回答、提示和错误模式。</p>
</Card>
```

- `variant`：`bordered`、`soft`、`plain`。
- `padding`：`small`、`medium`、`large`。
- `interactive` 只表达卡片包含主要链接，不会自动添加点击行为。

## FeatureCard

展示一个明确的产品能力，正文应保持简短并链接到详细页面。

```tsx
<FeatureCard
  eyebrow="Learner State"
  title="教学认知状态"
  description="根据真实学习行为更新掌握度、误解和下一步教学动作。"
  to="/docs"
  linkLabel="查看概念说明"
/>
```

图标是可选辅助内容，不应使用机器人、大脑、芯片或星星等泛 AI 图形。

## Screenshot

只展示真实产品截图，并强制提供尺寸以避免布局偏移。

```tsx
<Screenshot
  src="/img/product/learning-state.webp"
  alt="Converge 学习状态页面，显示知识点掌握度与错误证据"
  width={1600}
  height={1000}
  label="学习状态"
  meta="桌面端"
  caption="学习状态与证据来源保持关联。"
/>
```

- `alt` 描述截图传达的信息，不重复文件名。
- 截图必须来自真实界面，不伪造尚未实现的功能。
- `label` 和 `meta` 是轻量界面标识，不模拟浏览器装饰。

## Diagram

为流程图、架构图、时间线和数据关系图提供标题、说明、画布和图例结构。组件不决定具体节点布局。

```tsx
<Diagram
  title="一次完整的教学闭环"
  description="从识别学习目标到更新认知状态。"
  legend={<><span>实线：数据流</span><span>虚线：反馈</span></>}
  caption="复杂图示在窄屏幕上可以水平滚动。"
>
  <TeachingLoopDiagram />
</Diagram>
```

图示内部仍需使用语义化文字或 SVG `<title>`、`<desc>`，不能只依赖颜色和连线表达含义。

## CTA

用于页面或重要内容组的收束。默认采用分隔线和排版形成层级，不使用大面积渐变背景。

```tsx
<CTA
  title="从软件手册开始了解 Converge"
  description="查看安装、配置和第一个学习会话。"
  actions={
    <>
      <Button to="/docs">阅读手册</Button>
      <Button to="/download" variant="secondary">下载客户端</Button>
    </>
  }
/>
```

一个 CTA 只保留一个主要操作，次要操作使用 `secondary` 或 `text`。

## 视觉与可访问性约束

- 所有组件从 `src/css/custom.css` 读取语义化变量，禁止在页面中复制品牌色值。
- 组件支持亮色和暗色模式，并为键盘焦点提供统一样式。
- 动效只用于 Hover、状态变化和空间反馈，并响应 `prefers-reduced-motion`。
- 卡片以边框和背景层级为主，不使用发光、玻璃拟态和重阴影。
- 真实截图与信息图优先于长段文字和抽象装饰。
- 组件完成不代表页面完成；页面仍需按仓库根目录 `README.md` 中的质量要求验收。
