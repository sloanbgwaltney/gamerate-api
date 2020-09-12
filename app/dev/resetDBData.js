const { GameProfile } = require('../models/gameProfile')
const { User } = require('../models/user')
const { GameResult } = require('../models/gameResult')
// This is fine for now eventually will need to find a way to exclude from prod but still commit to repo
async function resetDBData() {
    await User.deleteMany({})
    await GameProfile.deleteMany({})
    await GameResult.deleteMany({})

    let user1 = new User()
    user1.username = 'testtest'
    user1.password = 'testtest'
    user1.email = 'u@u.com'
    await user1.hashPassword()
    user1 = await user1.save()

    let user2 = new User()
    user2.username = 'testtest2'
    user2.password = 'testtest2'
    user2.email = 'u2@u.com'
    await user2.hashPassword()
    user2 = await user2.save()

    let gp = new GameProfile()
    gp.name = 'testtest'
    gp.createPerformanceCategory({
        name: "testtest",
        minScore: 800,
        maxScore: 2400
    })
    gp.createPerformanceCategory({
        name: "testtest2",
        minScore: 200,
        maxScore: 2000
    })
    gp.createScoringPolicy({
        name: "testtest",
        weights: {
            "testtest": 60,
            "testtest2": 40
        }
    })

    gp = gp.save()

    let gr = new GameResult()
    gr.gameId = '123'
    gr.teams = {
        attacking: {
            [user1.id]: {
                performance: {
                    testtest: 600,
                    testtest2: 1000
                },
                policy: "testtest"
            }
        },
        defending: {
            [user2.id]: {
                performance: {
                    testtest: 600,
                    testtest2: 1000
                },
                policy: "testtest"
            }
        }
    }
    gr = await gr.save()
}

module.exports = { resetDBData }