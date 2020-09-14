const Faker = require('faker')
const { GameProfile } = require('../models/gameProfile')
const { User } = require('../models/user')
const { GameResult } = require('../models/gameResult')
// This is fine for now eventually will need to find a way to exclude from prod but still commit to repo
async function resetDBData() {
    try {
        const scriptStart = new Date().getTime()
        await User.deleteMany({})
        await GameProfile.deleteMany({})
        await GameResult.deleteMany({})

        let users = []
        for (let i = 0; i < 50; i++) { users.push(generateRandomUser()) }
        users = await Promise.all(users)
        let gameProfiles = []
        for (let i = 0; i < 50; i++) { gameProfiles.push(generateGameProfile(users[i].id)) }
        gameProfiles = await Promise.all(gameProfiles)
        let gameProfilesWithPCs = []
        for (let gameProfileIndex = 0; gameProfileIndex < gameProfiles.length; gameProfileIndex++) {
            for (let i = 0; i < 4; i++) {
                generatePerformanceCategory(gameProfiles[gameProfileIndex], users[randomRangedArrayNumber(50)].id)
            }
            gameProfilesWithPCs.push(gameProfiles[gameProfileIndex].save())
        }
        gameProfilesWithPCs = await Promise.all(gameProfilesWithPCs)
        const scriptEnd = new Date().getTime()
        console.log(`Script ran in ${scriptEnd - scriptStart} ms`)
    } catch (e) {
        console.log(e)
    }
    // let gr = new GameResult()
    // gr.gameId = '123'
    // gr.teams = {
    //     attacking: {
    //         [user1.id]: {
    //             performance: {
    //                 testtest: 600,
    //                 testtest2: 1000
    //             },
    //             policy: "testtest"
    //         }
    //     },
    //     defending: {
    //         [user2.id]: {
    //             performance: {
    //                 testtest: 600,
    //                 testtest2: 1000
    //             },
    //             policy: "testtest"
    //         }
    //     }
    // }
    // gr = await gr.save()
}


async function generateRandomUser() {
    const user = {
        username: Faker.internet.userName(),
        email: Faker.internet.email(),
        password: 'generateduser'
    }
    const modelUser = new User(user)
    await modelUser.hashPassword()
    return modelUser.save()
}

async function generateGameProfile(userId) {
    const gp = {
        name: Faker.internet.userName()
    }
    const gameProfile = new GameProfile(gp)
    return gameProfile.create(userId)
}

function generatePerformanceCategory(gp, userId) {
    const pc = {
        name: Faker.name.title(),
        minScore: 1000,
        maxScore: 4000
    }
    gp.createPerformanceCategory(pc, userId)
}

async function generateGameResult(attack, deffend) {
    const gr = {
        gameId: Faker.random.number(),
        teams: {
            attacking: {},
            defending: {}
        }
    }
}

function randomRangedArrayNumber(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports = { resetDBData }