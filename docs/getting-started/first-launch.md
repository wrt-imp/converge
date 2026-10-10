---
sidebar_position: 2
title: 第一次启动
description: 认识 Converge 启动后的工作区和本地存储。
---

import {StepCard, InfoBox} from '@site/src/components/DocBlocks';

# 第一次启动

## 适用对象

第一次打开 Converge 桌面工作台的用户。

## 前置条件

已完成 `uv sync`，并执行 `make run-app` 启动应用。

## 操作步骤

<StepCard number="01" title="先查看对话区">

对话区是 Agent 的主要入口。应用启动后，可以从快速开始入口选择角色，或直接输入学习问题。

</StepCard>

<StepCard number="02" title="打开扩展接口">

在侧边栏查看 Memory、知识、Skills、Wiki 和 MCP。它们分别负责长期信息、资料检索、可复用指令、结构化页面和外部工具。

</StepCard>

<StepCard number="03" title="确认模型状态">

进入设置的模型区域。如果还没有配置模型，页面会提示“还没有配置模型”，点击右上角“+ 添加”后再开始对话。

</StepCard>

## 预期结果

你能看到一个本地运行的工作台，并知道模型、会话、记忆、知识和 Skills 都是可管理的独立能力。

<InfoBox tone="tip" title="先完成最小配置">

第一次使用只需要先配置一个可用模型；知识库、Skills 和 MCP 可以在需要时再添加。

</InfoBox>

## 常见问题

Converge 的本地会话、记忆、知识与 Skills 使用本机数据目录保存。运行位置和数据位置可在运行信息或设置中查看。

## 下一步

阅读[配置模型](../manual/model-configuration)，完成第一次可用连接。

