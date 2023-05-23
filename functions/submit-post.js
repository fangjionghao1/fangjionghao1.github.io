const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

exports.handler = async function (event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' }
    }

    const { title, content } = JSON.parse(event.body)

    if (!title || !content) {
        return { statusCode: 400, body: '标题和内容不能为空' }
    }

    const date = new Date().toISOString()
    const fileName = `${date}-${title.replace(/ /g, '-')}.md`
    const filePath = path.join('content', 'posts', fileName)

    const frontMatter = {
        title,
        date,
        draft: false,
    }

    const fileContent = matter.stringify(content, frontMatter)

    fs.writeFileSync(filePath, fileContent)

    return { statusCode: 200, body: '文章已发布' }
}