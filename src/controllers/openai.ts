import { RequestHandler } from 'express'
import OpenAI from 'openai'

const openai = new OpenAI()

export const promptAI: RequestHandler = async (_, res, next) => {
    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content:
                        'I want you to act as Markdown README generator. Using this link learn the Markdown format https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet and now generate me a README for based on linkedin information  and Show me output in Markdown format only in codeblocks and no plain text. Dont write any explanations or output text other than a text in markdown format in codeblocks. The output should be in a large codeblocks that would fit the whole output. And use English write the output.'
                }
            ],
            model: 'gpt-3.5-turbo'
        })

        const content = chatCompletion.choices[0].message.content

        res.status(200).json({ content })
    } catch (err) {
        next(err)
    }
}
