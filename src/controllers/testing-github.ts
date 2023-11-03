import { RequestHandler } from 'express'
import { simpleGit } from 'simple-git'
import * as fs from 'fs'
import * as path from 'path'

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

    console.log('Checking if repository exists...')

    try {
        octokit.request(`GET /repos/${owner}/${owner}`)
    } catch (error) {
        return res.status(404).json({ data: "Repository doesn't exist!" })
    }

    console.log('Checking if fork exists...')

    let isForkedAlready = false

    try {
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

    console.log('Forking the repository...')

    // FORK THE REPOSITORY

    // CLONE THE REPOSITORY

    // MAKE CHANGES

    // COMMIT CHANGES

    // PUSH CHANGES

    // CREATE PULL REQUEST

    // DELETE LOCAL REPOSITORY

    res.status(200).json({ data: `Repo forked already: ${isForkedAlready}` })
}
