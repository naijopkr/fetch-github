const fs = require('fs')
const fetch = require('node-fetch')

const help = () => {
    console.log('Usage: node github.js -u <username> [-o <filename>]')
    console.log()
    console.log('\t-u\tGithub username to fetch public repos')
    console.log('\t-o\tFilename to save the data fetched')
    console.log()
}

const fetchGithub = (user, filename = 'github_repos.json') => {
    fetch(`https://api.github.com/users/${user}/repos?type=owner&sort=updated&per_page=100`)
    .then(res => {
        res.json().then(body => {
            const repos = {
                data: body
                .filter(repo => !repo.fork)
                .map(({ id, name, html_url, description, language, updated_at }) => {

                    return {
                        id,
                        name,
                        html_url,
                        description,
                        languages: [language],
                        updated_at,
                    }
                })
            }

            fs.writeFile(filename, JSON.stringify(repos, null, 2), err => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Successfully fetched data:')
                    console.log()
                    console.log(`Total entries: ${body.length}`)
                    console.log(`Filtered entries: ${repos.data.length}`)
                    console.log()
                }
            })
        })
    })
}

if (!module.parent) {
    if (process.argv.indexOf('-h') !== -1) {
        help()
    }

    try {
        const userIndex = process.argv.indexOf('-u')
        const username = userIndex > -1 && process.argv[userIndex + 1]

        const fileIndex = process.argv.indexOf('-o')
        const filename = fileIndex > -1
            ? process.argv[fileIndex + 1]
            : undefined

        if (!username) {
            throw new Error('No username provided')
        }

        fetchGithub(username, filename)

    } catch (err) {
        console.log('Error: ', err.message)
        help()
    }
}
