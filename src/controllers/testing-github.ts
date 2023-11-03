import { RequestHandler } from 'express'
import { simpleGit } from 'simple-git'
import * as fs from 'fs'
import * as path from 'path'

import { octokit } from '../api'

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

// export const deleteFilesInRepository: RequestHandler = (req, res, next) => {
//     const { owner, repo } = req.params

//     const deleteFiles: any = (path = '') =>
//         octokit.repos
//             .getContent({ owner, repo, path })
//             .then(({ data }) => {
//                 if (Array.isArray(data)) {
//                     return Promise.all(
//                         data.map(file => {
//                             if (file.type === 'dir') {
//                                 return deleteFiles(file.path)
//                             } else {
//                                 return octokit.repos.deleteFile({
//                                     owner,
//                                     repo,
//                                     path: file.path,
//                                     message: 'delete file',
//                                     sha: file.sha
//                                 })
//                             }
//                         })
//                     )
//                 }
//             })
//             .catch(err => console.error(err))

//     deleteFiles()
//         .then(() => {
//             res.status(200).json({ data: 'Data deleted.' })
//         })
//         .catch((err: Error) => {
//             next(err)
//         })
// }

const repoUrl = 'https://github.com/bejzik8/itmilos.git'
const localPath = path.resolve(__dirname, 'repo')

const git = simpleGit()

export const deleteFilesInRepository: RequestHandler = (req, res, next) => {
    git.clone(repoUrl, localPath)
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
