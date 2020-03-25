const fs = require('fs')
const fetch = require('node-fetch')

const help = () => {
    console.log('node github.js -u <username>')
    console.log()
    console.log('\t-u\tGithub username to fetch public repos')
    console.log()
}

const fetchGithub = (user) => {
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
}

if (!module.parent) {
    process.argv.forEach((value, index, array) => {
        switch(value) {
            case '-h':
                help()
                break
            case '-u':
                fetchGithub(array[index + 1])
                break
            default:
                break
        }
    })
}
