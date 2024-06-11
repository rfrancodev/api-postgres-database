const express =  require("express")

const PORT = 3333

const app = express()

app.use(express.json())

app.get('/', (req, res) => {console.log("Funcionando")})

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
