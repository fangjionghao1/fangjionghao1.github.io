---
title: '在线发布文章'
date: 2021-01-01
draft: false
---

在此页面上，您可以在线发布文章。

<form id="submit-post-form" action="/.netlify/functions/submit-post" method="POST">
  <label for="title">标题：</label>
  <input type="text" id="title" name="title" required><br><br>

<label for="content">内容：</label>
<textarea id="content" name="content" rows="10" cols="30" required></textarea><br><br>

<button type="submit">发布文章</button>

</form>
