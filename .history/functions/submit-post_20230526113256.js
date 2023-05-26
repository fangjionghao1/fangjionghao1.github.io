const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const { promisify } = require('util')

const writeFile = promisify(fs.writeFile)

exports.handler = async function (event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        }
    }

    const { title, content } = JSON.parse(event.body)

    if (!title || !content) {
        return {
            statusCode: 400,
            body: 'Invalid request: title and content are required',
        }
    }

    const postDate = new Date()
    const postFileName = `${postDate.toISOString().split('T')[0]}-${title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')}.md`

    const postFrontMatter = {
        title,
        date: postDate.toISOString(),
    }

    const postContent = matter.stringify(content, postFrontMatter)

    try {
        await writeFile(path.join('content', 'posts', postFileName), postContent)
    } catch (error) {
        return {
            statusCode: 500,
            body: `Error writing post file: ${error.message}`,
        }
    }

    return {
        statusCode: 200,
        body: `Post created: ${postFileName}`,
    }
}