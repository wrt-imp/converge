---
sidebar_position: 2
title: 导入知识库
description: 将 Markdown、代码、PDF 或 DOCX 导入本地知识库供 Agent 检索。
---

import {StepCard, InfoBox, Flow} from '@site/src/components/DocBlocks';

# 导入知识库

## 适用对象

需要让 Agent 检索课程材料、项目文档或代码的用户。

## 前置条件

已启动应用。准备好 Markdown、文本、代码、PDF 或 DOCX 文件。

## 操作步骤

<Flow steps={['打开知识', '导入文档', '等待处理', '搜索验证']} />

<StepCard number="01" title="打开“知识”">

在扩展接口中进入知识页面，点击“+ 导入文档”。

</StepCard>

<StepCard number="02" title="选择文件">

选择要导入的 Markdown、代码、PDF 或 DOCX 文件。知识库会将文件保存到本地知识存储。

</StepCard>

<StepCard number="03" title="等待导入完成">

导入完成后，文档会出现在知识列表中。可以在搜索框中输入关键词，检查是否能找到相关内容。

</StepCard>

<StepCard number="04" title="回到对话中使用">

在提问中明确指出课程主题或文档内容，Agent 会通过 RAG 检索相关片段，再结合对话进行回答。

</StepCard>

## 预期结果

文档出现在知识库中，并能通过关键词检索；相关片段可以被 Agent 用作教学参考。

<InfoBox tone="warning" title="格式限制">

当前知识库支持文本、代码、PDF 和 DOCX。其他文件类型会提示暂不支持。

</InfoBox>

## 常见问题

搜索没有结果时，先换一个文档中确实出现的关键词；不再需要的文档可以从知识列表中删除。

## 下一步

阅读[使用 RAG 检索知识](./use-rag)，验证检索片段并在对话中使用；也可以继续[使用 Skills](./use-skills)，让 Agent 按可复用的教学策略工作。
