---
sidebar_position: 1
title: 配置模型
description: 在 Converge 中添加模型服务商、凭据和连接。
---

import {StepCard, InfoBox, Flow} from '@site/src/components/DocBlocks';

# 配置模型

## 适用对象

需要让桌面 Agent 开始生成回答的用户。

## 前置条件

已启动 Converge，并准备好模型服务商要求的 API Key。

## 操作步骤

<Flow steps={['打开设置', '添加模型', '填写凭据', '启用模型']} />

<StepCard number="01" title="打开模型设置">

点击右侧的设置入口，进入模型配置区域。

</StepCard>

<StepCard number="02" title="点击“+ 添加”">

在模型库右上角点击“+ 添加”，新建一个模型配置。

</StepCard>

<StepCard number="03" title="填写服务商和 API Key">

按照模型服务商的配置要求填写模型信息和 API Key，然后保存配置。凭据只用于连接模型，不要写入 Wiki、知识文档或 Git。

</StepCard>

<StepCard number="04" title="确认启用状态">

模型出现在模型库后，确认开关处于启用状态，再返回对话区发送一条消息。

</StepCard>

## 预期结果

模型配置出现在列表中并处于可用状态，Agent 可以开始生成回答。

## 常见问题

如果模型无法使用，先检查 API Key、服务商配置和网络，再在设置中编辑模型配置并重试。

## 下一步

阅读[开始一轮苏格拉底式学习](../tutorials/socratic-learning)。

