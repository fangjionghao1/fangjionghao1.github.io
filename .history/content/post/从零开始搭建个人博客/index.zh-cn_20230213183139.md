---
title: 从零开始搭建个人博客
description: 搭建你自己的
date: 2023-02-13
slug: test-chinese
image: Snipaste_2023-02-13_18-16-10.png
categories:
  - hugo
  - github
  - hugo-theme-stack
---

#### 环境准备

- 系统环境：**Windows 10 专业版**
- 需求环境：git,hugo,go(1.16 or ⬆),scoop(window 包管理器 不熟悉的同学可以理解成和 npm 差不多的东西)
  [hugo 安装文档](https://gohugo.io/installation/windows/ 'hugo安装文档')

```cmd
# 安装 Hugo
brew install hugo(mac 👍)
scoop install hugo(win 👍)
# 创建一个新的网站（本地）
hugo new site quickstart && cd quickstart

# 拉取stack主题
git init
git clone https://github.com/CaiJimmy/hugo-theme-stack/ themes/hugo-theme-stack
# 将实例网站拷贝到博客根目录下
cp -r themes/hugo-theme-stack/exampleSite/* ./
# 删除config.toml以防冲突，之后配置文件使用config.yaml
rm config.toml

# 构建静态网站文件，并启动 HTTP 服务
hugo server -D


```
