---
title: 从零开始搭建个人博客
description: 搭建你自己的博客
date: 2023-02-13
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

  [scoop 安装教程](https://cloud.tencent.com/developer/article/1555034 'scoop安装教程')

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

#### 云开发部署——Github Pages 托管

- 先新建一个 github 仓库，如果你想使用 xxx.github.io 这个域名，**那么项目名称必须和用户名一致。**
- 第一步，来到 blog 目录，然后初始化 git，并推送到远程仓库。

```bash
git init
git add .
git commit -m 'init'
git branch -M main
git remote add origin https://.....git
# 如果认证失败，那么需要配置一下token，用下面的命令配置
git remote set-url origin https://{token}@{github.com/{username}/{repo_name}.git}
git push -u origin main

```

- 第二步，\***\*添加 gh-pages.yml 文件。\*\***
  在 blog 目录，新建一个名称为.github 的文件夹，然后在.github 文件夹下新建一个 workflows 文件夹，然后在 workflows 文件夹下新建一个文件叫 gh-pages.yml

  ```yml
  name: github pages
  permissions:
    contents: write
    on:
      push:
        branches:
          - main # Set a branch to deploy

    jobs:
      deploy:
        runs-on: ubuntu-20.04
        steps:
          - uses: actions/checkout@v3
            with:
              submodules: true # Fetch Hugo themes (true OR recursive)

          - name: Setup Hugo
            uses: peaceiris/actions-hugo@v2
            with:
              hugo-version: 'latest'
              # extended: true

          - name: Build
            run: hugo --minify

          - name: Deploy
            uses: peaceiris/actions-gh-pages@v3
            with:
              github_token: ${{ secrets.GITHUB_TOKEN }}
              publish_dir: ./public
  ```

* 第三步，把新代码推送到 github。查看 repo 的 actions 查看是否部署完成，等到部署完，到 setting→pages，将**branch 修改为 gh-pages， 点击 save。** 过一会，你的主页在 github pages 就托管好了。
  ![部署页面示例](Snipaste_2023-02-14_09-21-11.png)
