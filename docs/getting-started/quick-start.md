---
sidebar_position: 1
title: 快速开始
description: 安装依赖并启动 Converge 桌面工作台。
---

import {StepCard, InfoBox, Flow} from '@site/src/components/DocBlocks';

# 快速开始

## 适用对象

准备在本地运行 Converge 的开发者、教师和学生。

## 前置条件

- 已获取项目代码。
- 已安装 Python、`uv` 和 Go；项目的 Python 依赖由 `uv` 管理。

## 操作步骤

<Flow steps={['同步依赖', '启动工作台', '配置模型', '开始学习']} caption="先启动本地工作台，再在应用内完成模型配置。" />

<StepCard number="01" title="安装 Python 依赖">

在项目根目录执行：

```bash
uv sync
```

</StepCard>

<StepCard number="02" title="启动桌面工作台">

```bash
make run-app
```

</StepCard>

<StepCard number="03" title="添加模型并开始对话">

打开右侧设置，进入模型配置，添加自己的模型服务商和 API Key。完成后返回对话页。

</StepCard>

## 预期结果

桌面工作台启动，能够看到对话、Memory、知识、Skills、Wiki 和 MCP 等本地能力入口。

<InfoBox tone="note" title="本地数据">

本地会话和记忆默认保存在 `.data/agent.db`。不要把 API Key、密码、证书或本地运行数据提交到 Git。

</InfoBox>

## 常见问题

如果只想验证 Agent 或 Go Server，也可以分别执行：

```bash
make -C agent run-agent
cd server && go run ./cmd/server
```

## 下一步

阅读[第一次启动](./first-launch)，了解应用启动后的工作区。

