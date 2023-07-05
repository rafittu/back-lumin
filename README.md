# 🌼 Back-end da aplicação LUMIN

###

<br>

A API LUMIN é uma solução desenvolvida para Rosemeire, uma psicóloga que busca facilitar o registro de fichas de atendimento, o acompanhamento de consultas e o gerenciamento de pagamentos das sessões, antes realizados de forma manual. Esta API oferece recursos que garantem a confidencialidade das informações sensíveis dos clientes, proporcionando uma experiência segura e eficiente no gerenciamento dessas atividades.

Além disso, a API LUMIN realiza uma integração com a <a href="https://github.com/rafittu/back-alma" target="_blank">API ALMA</a>, permitindo a comunicação entre as duas para determinadas tarefas. Por exemplo, a criação de um novo usuário na API LUMIN aciona a API ALMA para garantir a sincronização dos dados do usuário em ambos os sistemas. 

Ao adotar o nome "LUMIN" para a API, mergulhamos na essência da luz como fonte de inspiração, representando a intenção de trazer clareza aos processos de atendimento e destacando-se como uma solução tecnológica que proporciona praticidade e eficiência aos usuários em seu cotidiano profissional.

<br>

## Tecnologias

Este projeto utiliza as seguintes tecnologias:

- **Node.js** com framework **NestJS** e **TypeScript**;
- **Prisma ORM** para comunicação e manipulação do banco de dados;
- **Docker** como uma ferramenta de containerização;
- **Axios** para realizar requisições HTTP;

<br>

## Instalação

Clonando o repositório:

```bash
$ git clone git@github.com:rafittu/back-lumin.git
```

Instalando as dependências:

```bash
$ npm install
```

<br>

## Iniciando o app

Crie um arquivo `.env` na raiz do projeto e preencha as informações de acordo com o arquivo `.env.example` disponível.

Iniciando o servidor:

```bash
# modo de desenvolvimento
$ npm run start

# modo de observação
$ npm run start:dev
```

<br>

##

<p align="right">
  <a href="https://www.linkedin.com/in/rafittu/">Rafael Ribeiro 🚀</a>
</p>
