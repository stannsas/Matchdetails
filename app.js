const express = require('express')
const app = express()
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

app.use(express.json())

const dbpath = path.join(__dirname, 'cricketMatchDetails.db')
let db = null

const initializeDbServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDbServer()

app.get('/players/', async (request, response) => {
  const playersQuery = `
      SELECT 
        player_id AS PlayerId,
        player_name AS PlayerName
      FROM player_details;`

  const allPlayers = await db.all(playersQuery)
  response.send(allPlayers)
})

//api 2:
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getplayerQuerey = `
  select
   player_id  AS playerId,
    player_name AS PlayerName
    from 
    player_details
    where
    player_id=?;`
  const playerQuerey = await db.get(getplayerQuerey)
  response.send(playerQuerey)
})

//api3:
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName} = playerDetails
  const updateQuerey = `
  update player_details
  set
  player_name='${playerName}'
  where
  player_id=${playerId};`
  await db.run(updateQuerey)
  response.send('Players Details Updated')
})

//api4:
app.get('/matches/:matchId/',async (request, response) => {
  const {matchId} = request.params
  const getMatchDetailsQuery = `
  select match_id as matchId,
  match,
  year
  from 
  match_details
  where
  match_id=${matchId}; `;
  const matchdetails=await db.get(getMatchDetailsQuery)
  response.send(matchdetails)
})
module.exports = app
