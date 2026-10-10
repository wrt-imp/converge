---
sidebar_position: 3
title: 使用 Skills
description: 搜索、启用和新建可复用的教学指令集。
---

import {StepCard, InfoBox} from '@site/src/components/DocBlocks';

# 使用 Skills

## 适用对象

希望复用固定教学流程、写作规范或分析方法的用户。

## 前置条件

已启动应用。内置 Skills 可直接查看；自定义 Skill 需要准备名称、说明和指令。

## 操作步骤

<StepCard number="01" title="打开 Skills 页面">

在扩展接口中点击 Skills。页面会显示 Skill 总数、已启用数量，并标注内置、项目、用户或本地来源。

</StepCard>

<StepCard number="02" title="搜索并启用 Skill">

在“搜索 Skill”中按名称或说明查找。对可编辑的 Skill 打开开关；内置 Skill 可以查看，但不能直接修改。

</StepCard>

<StepCard number="03" title="在对话中按需调用">

在消息中明确指定 Skill，例如“请使用苏格拉底式问答”。Agent 会按需发现和加载匹配的 Skill。

</StepCard>

<StepCard number="04" title="新建自己的 Skill">

点击“+ 新建 Skill”，填写名称、说明和指令，选择是否启用后保存。也可以点击“打开 Skill 目录”查看本地位置。

</StepCard>

## 预期结果

对话会使用指定的可复用指令集；自定义 Skill 会出现在列表中，并可再次编辑或删除。

<InfoBox tone="tip" title="一个 Skill 只解决一种工作方式">

把“适合什么任务”和“必须遵守的步骤”写进说明与指令，不要把课程原文混入 Skill；课程资料应放入知识库。

</InfoBox>

## 常见问题

如果没有加载预期 Skill，先检查它是否已启用，并在消息中使用准确的 Skill 名称。

## 下一步

阅读[查看学习记忆](../manual/learning-memory)，了解长期信息如何被审核和管理。

