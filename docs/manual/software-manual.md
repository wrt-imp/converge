---
sidebar_position: 0
title: 软件手册
description: 了解 Converge 的工作区、核心能力和数据边界。
---

import {StepCard, InfoBox, Flow} from '@site/src/components/DocBlocks';

# 软件手册

## 适用对象

第一次系统了解 Converge 工作方式的学生、教师和项目开发者。

## 前置条件

已获取项目代码，并知道 Converge 当前以本地桌面工作台为主要使用入口。

## 操作步骤

<Flow steps={['认识工作区', '配置模型', '准备知识', '开始教学', '复盘证据']} caption="Converge 把模型、知识、Skills、Memory 和教学对话组织在同一条学习闭环中。" />

<StepCard number="01" title="认识工作区中的能力入口">

对话区用于开始学习；Memory 保存长期事实、偏好、目标和约束；知识用于检索课程资料；Skills 用于复用教学或工作方法；Wiki 用于维护可编辑的结构化知识页面；MCP 用于连接外部工具。

</StepCard>

<StepCard number="02" title="配置一个可用模型">

在设置中添加模型服务商和 API Key，并确认模型处于启用状态。模型配置只负责连接模型，不替代知识库、Skills 或 Memory。

</StepCard>

<StepCard number="03" title="按用途放置信息">

课程原文、项目文档和代码放入知识库；可复用的教学步骤放入 Skills；偏好、目标和稳定事实进入 Memory；知识点、来源和页面关系维护在 Wiki 中。

</StepCard>

<StepCard number="04" title="用一轮对话观察学习状态">

从一个具体知识点开始，让 Agent 通过追问、提示、反例或练习观察回答。苏格拉底式状态机会区分答对、部分正确、答错和连续答错，并据此调整下一步教学动作。

</StepCard>

<StepCard number="05" title="回到证据和记忆复盘">

Session、Message 和 Agent Run 会保留问题、回答、追问、提示、工具调用和运行结果。Memory 中的候选内容应在需要时审核；学习掌握度、误解和错误证据属于教学认知状态，不等同于普通记忆。

</StepCard>

## 预期结果

你能根据问题选择正确的入口：用模型连接生成能力，用知识库提供资料，用 Skills 约束工作方式，用 Memory 管理长期信息，再用教学对话形成可回溯的学习证据。

<InfoBox tone="note" title="项目边界">

Converge 的目标不是只保存聊天记录，也不是把所有资料塞进 Memory；它要持续观察学生当前会什么、不会什么、误解什么，以及下一步如何教学。

</InfoBox>

## 常见问题

### Memory 能代替知识库吗？

不能。Memory 适合稳定的长期信息，原始课程资料应放入知识库，工作方法应放入 Skills。

### 一定要同时配置所有能力吗？

不需要。先配置一个可用模型即可开始；知识库、Skills、Memory、Wiki 和 MCP 按实际任务逐步使用。

### 数据保存在哪里？

本地会话和记忆默认保存在 `.data/agent.db`；运行信息或设置中可以查看具体位置。不要把 API Key、密码、证书或本地运行数据提交到 Git。

## 下一步

先阅读[快速开始](../getting-started/quick-start)，然后按需要继续阅读[配置模型](./model-configuration)、[导入知识库](../tutorials/import-knowledge)或[开始一轮苏格拉底式学习](../tutorials/socratic-learning)。

