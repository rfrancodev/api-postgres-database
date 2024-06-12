const express =  require("express")
const {Pool} = require('pg')
require('dotenv').config()

const PORT = 8888

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL})

const app = express()

app.use(express.json())

app.get('/',  (req, res) => {console.log("Funcionando")})



app.get('/users',async (req, res) => {
    try {
        const {rows} = await pool.query('SELECT * FROM users')
        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send(error)
    }
})

app.post('/session',async (req, res) => {
    const {username} = req.body
    let user = ''
    try {
        user = await pool.query('SELECT * FROM users WHERE user_name = ($1)', [username])
        if (!user.rows[0]) {
        user = await pool.query('INSERT INTO users(user_name) VALUES ($1) RETURNING *' ,[username])
        }
    return res.status(200).send(newSession.rows)
        } catch (error) {
    return res.status(400).send(error)
    }
})

app.post('/petong/:user_id', async(req, res) =>{
    const {description, done} = req.body
    const {user_id} = req.params
    try {
        const newPetong = await pool.query('INSERT INTO petong(petong_description, petong_done, user_id) VALUES ($1, $2, $3) RETURNING *' ,[description, done, user_id])
        return res.status(200).send(newPetong.rows)
        
    } catch (error) {
        return res.status(400).send(error)
    }
})

app.get('/petong/:user_id', async (req, res)=>{
    const {user_id} = req.params
    try {
        const allPetong = await pool.query('SELECT * FROM petong WHERE user_id = ($1)', [user_id])
        return res.status(200).send(allPetong.rows)
        
    } catch (error) {
        return res.status(400).send(error)
    }
})

app.patch('/petong/user_id/:petong_id', async(req,res)=>{
    const {petong_id, user_id}= re.params
    const data = req.body
    
    try {
        const belongToUser = await pool.query('SELECT * FROM petong WHERE user_id = ($1) AND petong_id = ($2)', [user_id, petong_id])
        if (!belongToUser.rows[0]) return res.status(400).send('Operation not allowed')

        const updatePetong = await pool.query('UPDATE petong SET petong_description = ($1), petong_done = ($2), WHERE pentong_id = ($3) RETURNING *', [data.description, data.done, petong_id])
        return res.status(200).send(updatePetong.rows)
        
    } catch (error) {
        return res.status(400).send(error)
    }
})

app.delete('/petong/:user_id/:petong_id', async(req, res)=>{
    const {user_id, petong_id}= req.params
    try {
        const deletarPetong = await pool.query('DELETE FROM petong WHERE petong_id = ($1) RETURNING *', [petong_id])
        return res.status(200).send({
            message: 'Usuario deletado com sucesso', 
            deletarPetong
        })
    } catch (error) {
        return res.status(400).send(error)
    }
})


app.listen(PORT, () => console.log(
    `Servidor rodando na porta ${PORT}`))
