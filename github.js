const fs = require('fs')
const fetch = require('node-fetch')

fetch('https://api.github.com/users/naijopkr/repos?type=owner')
    .then(res => {
        res.json().then(body => {
            const repos = {
                data: body
                .filter(repo => !repo.fork)
                .map(({ id, name, html_url, description, language, updated_at }) => {
                    if (Array.isArray(language)) {
                        console.log(language)
                    }

                    return {
                        id,
                        name,
                        html_url,
                        description,
                        languages: [language],
                        updated_at,
                    }
                })
                .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            }

            fs.writeFile('github.json', JSON.stringify(repos, null, 2), err => {
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
