/* 
Instale as bibliotecas e o cliente de API:
npm init
npm i express
Procure pela extensão RapidAPI Client no VSCode.
*/
// Para executar a API no terminal: node index.js
// Link para testar a API: http://localhost:3000/rota
const express = require("express")
const app = express()
const port = 3000
app.use(express.json()) // configura API para usar JSON.
const fs = require('fs') // importa leitura e escrita de arquivos.


app.use(express.json());




//======================   POST  ==============



app.post("/filmes", (req, res) => {
  const filme = req.body;

  if (!filme || Object.keys(filme).length === 0) {
    return res.status(400).json({ resposta: "Body não preenchido" });
  }

  try {
    let bd = [];

    if (fs.existsSync('filmes.json')) {
      const data = fs.readFileSync('filmes.json', 'utf-8');
      bd = JSON.parse(data);
    }

    bd.push(filme);

    fs.writeFileSync('filmes.json', JSON.stringify(bd, null, 2));

    console.log(' Filme registrado', filme);

    res.status(201).json({ resposta: "filme cadastrado !!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ resposta: "Erro interno no servidor" });
  }
});



//=====================  GET FILMES ===================



app.get ("/filmes", (req, res )=> {
  try {
    const filmes = JSON.parse (fs.readFileSync('filmes.json', 'utf-8'))
    res.status(200).json(filmes)
  } catch (error) {
    res.status(500).json ({resposta:error.message})

  }
})




//===================  GET FILMES POR ID ==================



app.get("/filmes/:id", (req, res) => {
  const { id } = req.params;
  try {
    if (!fs.existsSync('filmes.json')) {
      return res.status(404).json({ resposta: "Nenhum filme cadastrado ainda" });
    }
    const data = fs.readFileSync('filmes.json', 'utf-8');
    const filmes = JSON.parse(data);
    const idBuscado = id.replace(/[^\d]/g, '');
    const filmeEncontrado = filmes.find((filme) => {
      if (!filme.id) return false;
      const idDoFilme = filme.id.replace(/[^\d]/g, '');
      return idDoFilme === idBuscado;
    });
    if (!filmeEncontrado) {
      return res.status(404).json({ resposta: "Filme não encontrado com este id" });
    }
    res.status(200).json(filmeEncontrado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ resposta: error.message });
  }
});




//=================  DELET FILMES POR ID ===========




app.delete("/filmes/:id", (req, res) => {
  const { id } = req.params;

  try {
    if (!fs.existsSync('filmes.json')) {
      return res.status(404).json({ 
        resposta: "Nenhum filme cadastrado ainda" 
      });
    }

    const data = fs.readFileSync('filmes.json', 'utf-8');
    let filmes = JSON.parse(data);

    const idLimpo = id.replace(/[^\d]/g, '');

    const indice = filmes.findIndex(filme => 
      filme.id.replace(/[^\d]/g, '') === idLimpo
    );

    if (indice === -1) {
      return res.status(404).json({ 
        resposta: "Filme não encontrado" 
      });
    }
    const filmeRemovido = filmes.splice(indice, 1)[0];

    fs.writeFileSync('filmes.json', JSON.stringify(filmes, null, 2));

    res.json({
      resposta: "Filme deletado com sucesso",
      filme: filmeRemovido
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      resposta: "Erro ao deletar filme",
      erro: error.message 
    });
  }
});


//=============== GET FILMES POR GENERO ==================



app.get ('/filmes/genero/:genero', (req,res) => {

  const generoBuscado = req.params.genero;
  const filmesFiltrados = listagemFilmes.filter(filme => filme.genero === generoBuscado)
  if (filmesFiltrados.length === 0 ) {
    return res.status(404).json ("Filmes desse gemero não encontrado");
  }
  return res.status(200).json (filmesFiltrados);
  }
)




//=========== API RODANDO ===============



app.listen(port, () => {
  console.log(` API rodando em http://localhost:${port}`);
});

