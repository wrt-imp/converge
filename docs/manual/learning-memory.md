---
sidebar_position: 2
title: 查看学习记忆
description: 查看、审核和管理 Converge 保存的长期记忆。
---

import {StepCard, InfoBox, Flow} from '@site/src/components/DocBlocks';

# 查看学习记忆

## 适用对象

需要检查 Agent 记住了什么，或希望控制长期信息写入方式的用户。

## 前置条件

已启动应用并完成模型配置。

## 操作步骤

<Flow steps={['打开 Memory', '选择策略', '审核候选', '管理记录']} />

<StepCard number="01" title="打开 Memory 页面">

在扩展接口中进入 Memory，查看已有记忆或待审核候选。

</StepCard>

<StepCard number="02" title="选择记忆策略">

应用提供“关闭记忆”“保存前审核”和“自动保存”三种策略。根据需要选择，不要把短期聊天内容都当作长期记忆。

</StepCard>

<StepCard number="03" title="审核候选">

在保存前审核模式下，检查候选内容、来源、置信度和重要度，再决定是否保留。

</StepCard>

<StepCard number="04" title="区分记忆与学习状态">

Memory 适合保存偏好、目标、事实和约束；学生对某个知识点的掌握、误解和错误证据属于教学认知状态，不等同于普通记忆。

</StepCard>

## 预期结果

你能查看 Agent 的长期信息，并在需要时审核、软删除或调整记忆，而不会把一次性对话误当成稳定事实。

<InfoBox tone="warning" title="敏感信息">

不要把 API Key、密码、证书或私钥保存到 Memory、Wiki 或知识文档中。

</InfoBox>

## 常见问题

如果 Agent 没有记住某项内容，检查记忆策略是否关闭，或该内容是否仍处于待审核状态。

## 下一步

继续阅读[使用 Memory](../tutorials/use-memory)按步骤搜索、添加和清理记忆；遇到启动、连接或导入问题时，查看[常见错误](../troubleshooting/common-errors)。
