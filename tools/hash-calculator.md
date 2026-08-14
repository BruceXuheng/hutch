---
id: hash-calculator
name: Hash 计算
name_en: Hash Calculator
category: dev
icon: "⌗"
color: amber
runtime: local
component: HashCalculator
tags: [Hash, 摘要, 校验]
keywords: [hash, sha, sha256, digest, 摘要, 校验, checksum, 指纹]
pinned: false
order: 4
status: live
desc: 计算文本或文件的 SHA-1/256/384/512 摘要，基于 Web Crypto API。
---

# Hash 计算

计算文本或文件的 SHA 系列摘要，基于原生 Web Crypto API，零依赖。

## 功能

- 算法：SHA-1 / SHA-256 / SHA-384 / SHA-512
- 输入：文本粘贴或文件选择
- 结果以 hex 输出，一键复制
- 实时显示字节数

## 说明

MD5 不被 Web Crypto 支持，故仅提供 SHA 系列；SHA-256 为默认推荐。

## 适用场景

- 文件完整性校验
- 密码/令牌指纹（勿用于存储密码，请用 bcrypt/argon2）
