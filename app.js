// load express
const express = require('express')

// SQL
const MOVIE_NAME_BY_DESC = 'SELECT name, tvid FROM tv_shows ORDER BY name DESC LIMIT 20'
const MOVIE_BY_ID = 'SELECT * FROM tv_shows WHERE tvid = ?'

module.exports = function(p) {
    const pool = p
    const router = express.Router()

    // load resources
    router.use(express.static(`${__dirname}/static`))

    // #### GET route ####
    router.get('/', async (req, resp) => {

        let conn

        try {
            conn = await pool.getConnection()
            const results = await conn.query(MOVIE_NAME_BY_DESC)
            const movies = results[0]
            const root = req.baseUrl
            conn.release()
                
            resp.status(200)
            resp.type('text/html')
            resp.render('landing',
                {
                    title: 'Landing page',
                    root,
                    movies
                }
            )
        } 
        catch (e) {
            console.error("Error retrieving from database! ", e)
        }
    })

    router.get('/movies/:tvid', async (req, resp) => {
        const tvid = req.params.tvid 
        let conn

        try {
            conn = await pool.getConnection()
            const result = await conn.query(MOVIE_BY_ID, tvid)
            const movie = result[0]
            
            conn.release()

            resp.status(200)
            resp.type('text/html')
            resp.render('detailed', 
                {
                    title: 'Details',
                    movie: movie[0]
                }
            )
        } 
        catch (e) {
            console.error("Error retrieving from database! ", e)
        }
    })

    // ## REDIRECT ##
    router.use((req, resp) => {
        resp.redirect('/')
    })

    return (router)
}