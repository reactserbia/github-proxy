import { RequestHandler } from 'express'
import { simpleGit } from 'simple-git'
import * as fs from 'fs'
import * as path from 'path'
import { setTimeout } from 'timers/promises'

import { octokit } from '../api'

const git = simpleGit()

export const getLoggedInUser: RequestHandler = (_, res, next) => {
    octokit
        .request('GET /user')
        .then(response => {
            res.status(200).json({ data: response.data })
        })
        .catch(err => {
            next(err)
        })
}

export const getUserByUsername: RequestHandler = (req, res, next) => {
    const { username } = req.params

    octokit
        .request(`GET /users/${username}`)
        .then(response => {
            res.status(200).json({ data: response.data })
        })
        .catch(err => {
            next(err)
        })
}

export const getRepository: RequestHandler = (req, res, next) => {
    const { owner, repo } = req.params

    octokit
        .request(`GET /repos/${owner}/${repo}`)
        .then(response => {
            res.status(200).json({ data: response.data })
        })
        .catch(err => {
            next(err)
        })
}

export const forkRepository: RequestHandler = (req, res, next) => {
    const { owner, repo } = req.params

    octokit
        .request(`POST /repos/${owner}/${repo}/forks`)
        .then(response => {
            res.status(200).json({ data: response.data })
        })
        .catch(err => {
            next(err)
        })
}

export const deleteFilesInRepository: RequestHandler = (req, res, next) => {
    const { owner, repo } = req.params

    const repositoryUrl = `https://github.com/${owner}/${repo}.git`
    const localPath = path.resolve(__dirname, repo)

    git.clone(repositoryUrl, localPath)
        .then(() => git.cwd(localPath))
        .then(() =>
            fs.readdirSync(localPath).forEach(file => {
                if (file !== '.git') {
                    fs.rmSync(path.join(localPath, file), {
                        recursive: true,
                        force: true
                    })
                }
            })
        )
        .then(() => git.add('./*'))
        .then(() => git.commit('Deleted all files and folders.'))
        .then(() => git.push('origin', 'main'))
        .then(() => {
            fs.rmdirSync(localPath, { recursive: true })
            return res.status(200).json({ data: 'Data deleted.' })
        })
        .catch((err: Error) => {
            next(err)
        })
}

export const updateReadme: RequestHandler = async (req, res, next) => {
    const { owner } = req.params

    try {
        console.log('Checking if the repository exists...')

        octokit.request(`GET /repos/${owner}/${owner}`)
    } catch (error) {
        return res.status(404).json({ data: "Repository doesn't exist!" })
    }

    console.log('The repository exists...')

    let isForkedAlready = false

    try {
        console.log('Checking if a fork exists...')

        await octokit.request(`GET /repos/bejzik8/${owner}`)

        isForkedAlready = true
    } catch (error) {}

    console.log(`Fork ${isForkedAlready ? 'exists' : "doesn't exist"}...`)

    if (isForkedAlready) {
        try {
            console.log('Deleting the fork...')

            await octokit.request(`DELETE /repos/bejzik8/${owner}`)

            console.log('The fork deleted...')
        } catch (error) {
            return next(error)
        }
    }

    try {
        console.log('Forking the repository...')

        await octokit.request(`POST /repos/${owner}/${owner}/forks`)

        console.log('The repository forked...')
    } catch (error) {
        return next(error)
    }

    await setTimeout(5000)

    const repositoryUrl = `https://github.com/bejzik8/${owner}.git`
    const localPath = path.resolve(__dirname, owner)

    try {
        console.log('Cloning the repository...')

        await git.clone(repositoryUrl, localPath)

        console.log('The repository cloned...')
    } catch (error) {
        return next(error)
    }

    console.log('Deleting all files and folders...')

    try {
        await git.cwd(localPath)

        await fs.readdirSync(localPath).forEach(file => {
            if (file !== '.git') {
                fs.rmSync(path.join(localPath, file), {
                    recursive: true,
                    force: true
                })
            }
        })

        await git.add('./*')

        await git.commit('Deleted all files and folders.')

        console.log('All files and folders deleted...')

        console.log('Creating a new README.md file...')

        await fs.writeFileSync(
            path.join(localPath, 'README.md'),
            `# ${owner}\n\nThis is a forked repository by Mirko Basic 🍀.`
        )

        await git.add('./*')

        await git.commit('Created a new README.md file.')

        console.log('The README.md file created...')

        console.log('Pushing changes...')

        await git.push('origin', 'main')

        console.log('Changes pushed...')
    } catch (error) {
        return next(error)
    }

    try {
        console.log('Creating a pull request...')

        await octokit.request(`POST /repos/${owner}/${owner}/pulls`, {
            owner,
            repo: owner,
            title: "Testing GitHub's API...",
            body: "Don't merge this pull request!",
            head: 'bejzik8:main',
            base: 'main',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })

        console.log('The pull request created...')
    } catch (error) {
        return next(error)
    }

    console.log('Deleting the local repository...')

    fs.rm(localPath, { recursive: true, force: true }, error => {
        if (error) {
            console.error('Failed to delete directory:', error)
        }
    })

    console.log('The local repository deleted...')

    return res
        .status(200)
        .json({ data: 'The repository successfylly updated! 🍀' })
}
