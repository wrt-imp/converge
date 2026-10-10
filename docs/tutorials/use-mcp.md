---
sidebar_position: 4
title: 使用 MCP
description: 添加、测试并管理 MCP 外部工具连接。
---

import {StepCard, InfoBox, Flow} from '@site/src/components/DocBlocks';

# 使用 MCP

## 适用对象

希望让 Converge 在任务中调用外部工具的用户。

## 前置条件

已启动桌面工作台。准备好 MCP 服务提供的本地命令或远程 URL；如服务需要认证，提前准备凭据，并将凭据放入环境变量。

## 操作步骤

<Flow steps={['打开 MCP', '添加或导入服务', '测试连接', '在对话中使用']} />

<StepCard number="01" title="打开 MCP 服务器页面">

在工作台的扩展能力区域进入 **MCP**，选择 **MCP 服务器**。这里可以查看已配置服务、启用状态和连接结果。

</StepCard>

<StepCard number="02" title="添加服务配置">

点击 **+ 添加**，选择 **快速创建**，填写服务器 ID、保存范围（用户或当前项目）和传输方式（`stdio`、SSE 或 Streamable HTTP）。`stdio` 服务还需填写命令、JSON 参数和可选工作目录；远程服务填写 URL 与请求头。

也可以选择 **从 JSON 导入**。Converge 接受 `mcpServers` 配置格式，并会逐个测试导入的服务。用户配置位于 `~/.converge/mcp.json`，项目配置位于 `<workspace>/.converge/mcp.json`；同名项目配置优先。

</StepCard>

<InfoBox tone="warning" title="保护服务凭据">

环境变量和请求头字段支持 `${ENV_VAR}` 引用。不要把真实 token 或密码直接写进项目配置，也不要提交到 Git。只添加信任的 MCP 服务；具有文件写入或终端能力的服务要谨慎启用。

</InfoBox>

<StepCard number="03" title="真实测试后保存">

在快速创建窗口点击 **测试并保存**；JSON 导入则点击 **验证并导入**。Converge 会初始化服务并读取工具列表，测试成功后才保存配置。若缺少运行组件，打开 **运行环境** 页面按提示检查或安装。

</StepCard>

<StepCard number="04" title="在任务中使用工具">

保存后的配置从下一次 Agent 请求开始加载。回到对话中提出一个需要该服务能力的具体任务，再返回 MCP 页面确认服务和工具状态。单个服务故障不会阻止其他服务启动。

</StepCard>

## 预期结果

服务通过真实连接测试，工具列表可以读取；下一轮对话可按任务调用已启用工具。

## 常见问题

### 配置文件存在，为什么服务仍不可用？

配置文件存在不代表握手成功。检查运行环境、命令和参数、远程 URL 及请求头，然后重新测试连接。

### 修改配置后为什么还没生效？

新配置会在下一次 Agent 请求开始时加载。发起新一轮对话后再检查。

### 一个 MCP 服务失败会影响其他服务吗？

不会。服务按独立连接启动；逐个检查失败服务的错误信息即可。

## 下一步

阅读[使用 RAG 检索知识](./use-rag)，了解如何让回答参考本地课程资料。
