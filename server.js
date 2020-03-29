//configuradno o express

const express = require ('express'); //importando o express
const server = express() // definindo a variavel server com a funcao do express

//configurando o servidor para apresentar arquivos estáticos

server.use(express.static('public'))//aqui voce pede para o express pegar TODOS os arquivos estaticos como html, css, imagens etc.. e jogar na pasta public


//Habilitando o body do HTML para acessar os dados do formulario

server.use(express.urlencoded({extended: true}))


//configurando conexao com o banco de dados

const Pool = require('pg').Pool
const db = new Pool({
    user: "postgres",
    password: "123@senac",
    host: "localhost",
    port: 5432,
    database: "doe"
})

//configurdando a template engine nunjucks, nunjucks procura o arquivo HTML e faz ele abrir no servidor, por isso é necessario passar o caminho para ele

const nunjucks = require('nunjucks') //estou dizendo ao nunjucks para usar o express, e dentro do express buscar o valor server
nunjucks.configure("./", {
express: server,  /*O Nunjucks acessa o caminho raiz "./" e depois usa o objeto express que tem o valor server*/
noCache: true //limpa o cache do navegador para poder atualizar

})


//configurando o caminho que o servidor vai acessar

server.get("/", function(req, res){ /*servidor acessa o caminho "/ " e depois faz uma funcao.é necesssario passar o caminho e o que deve ser feito ao chegar no caminho. req é requisições do servidor. res são respostas d servidor*/

db.query("SELECT * FROM donors", function(err, result){
    if (err)
    return res.send('erro de banco de dadossss')

    const donors = result.rows
    return res.render("index.html", {donors})



return res.render("index.html", {donors})// aqui o servidor retorna através do res, uma resposta dizendo que acessou o caminho e a função requisitada.
})

})


//Recebendo dados do formulário com metodo POST

server.post("/", function(req, res){
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == ""){
        return res.send('todos os campos são obrigatorios')
    }

//colocando novos valores no banco de dados

    const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err){
        if (err) return res.send('Erro no banco de dados')
    
        return res.redirect("/")
    
    })    
})

//Configurando a porta qe o servidor vai acessar

server.listen(3030, function(){
   console.log('iniciei o server') 
}) //escutar a porta 3030 do server 127.0.0.1. o console.log mostra uma mensagem dizendo que conseguiu iniciar o servidor