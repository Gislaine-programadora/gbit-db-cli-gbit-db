# GBIT Database

Servidor de banco de dados do projeto, integrado com o **gbit-db-dados** (banco local, em arquivos, zero dependências).

Essa pasta é gerada automaticamente pelo CLI `gbit-db` dentro do seu projeto e já vem pronta para uso — os dados ficam salvos em `gbit-database/data/`, usando o `gbit-db-dados` como motor de armazenamento.

# Cli integrado gbit-db-dados com o backend gbit-database ele roda  

# my-project/gbit-database

## Como rodar

```bash
node server.js
```

O servidor sobe em `http://localhost:4200`.

> ⚠️ Os comandos do projeto (instalar dependências, subir o Next.js, o Portal, o Container, etc.) são todos executados na **raiz do projeto**, não dentro desta pasta. Aqui dentro você só roda o `server.js` quando quiser subir o banco isoladamente.


# use gbit-container para abrir a url no navegador sem rodar os comandos:


```bash
npx install gbit-container
```


```bash
npx gbit-container
```

```bash
npx gbit-container init
```

```bash
npx gbit-container up
```

```bash
npx gbit-container dashboard
```


## Estrutura

```
gbit-database/
├── server.js         # ponto de entrada — sobe o servidor do banco
├── index.js           # exporta a instância principal do banco
├── test.js             # testes do banco
│
├── config/               # configurações (porta, paths, variáveis de ambiente)
├── core/                  # inicialização e bootstrap do servidor
├── engine/                 # integração com o gbit-db-dados (motor de dados)
├── orm/                     # camada de mapeamento sobre as coleções
├── query/                    # helpers de consulta
├── schema/                    # definição e validação de schemas das coleções
├── middleware/                  # middlewares do servidor (auth, logs, erros, etc.)
├── controllers/                   # lógica das rotas
├── routes/                         # definição dos endpoints HTTP
├── services/                        # regras de negócio
│
└── data/                              # dados do gbit-db-dados (coleções, índices, backups)
```

## Banco de dados com backend 

# Na raiz baixe o cli do banco

```bash
npm install gbit-db-dados
```

```bash
npx gbit-db-dados
```


Os dados reais ficam em `data/`, no formato do **gbit-db-dados**:

```
data/
├── database.json
├── metadata.json
├── collections/
├── indexes/
├── transactions/
└── backups/
```
##  Testar crud na raiz do projeto,

 curl http://localhost:4200/collections/users

## criar colecoes post,

 curl -X POST http://localhost:4200/collections/users



## Banco de dados com Gbit-db-dados integra com seu backend 

<p align="center">
  <img src="assets/imagem-modo-uso-dados.png" width="1200">
</p>




## email: gislainelophes@gmail

Saiba mais sobre o motor de banco: [gbit-db-dados](https://github.com/Gislaine-programadora/gbit-db-dados)



## Licença

MIT