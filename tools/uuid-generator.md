---
id: uuid-generator
name: UUID 生成器
name_en: UUID Generator
category: dev
icon: "#"
color: purple
runtime: local
component: UuidGenerator
tags: [UUID, 生成, 唯一ID]
keywords: [uuid, guid, 生成, 唯一, id, random, v4]
pinned: false
order: 3
status: live
desc: 批量生成 UUID v4，支持去连字符、大写、批量复制。
---

# UUID 生成器

批量生成 UUID v4（基于原生 crypto.randomUUID，零依赖），支持去连字符与大写、批量复制。

## 功能

- 批量生成 1–500 个 UUID v4
- 可选去连字符 / 转大写
- 单条复制、全部复制
- 原生 API，无第三方库

## 适用场景

- 数据库主键、测试数据
- 一次性令牌、会话 ID
