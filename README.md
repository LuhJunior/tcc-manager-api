# TCC Manager API
Uma API REST para manter os dados sobre os projetos de TCC.

## Descrição

[Nest](https://github.com/nestjs/nest) é o framework utilizado para contruir essa API.

## Compilação

Para compilar é necessário possuir o gerenciador de pacotes npm ou yarn
e executará os seguintes comandos.

```bash
$ npm i
$ npm run build
```

## Execução
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

Caso possua o docker para começar a desenvolver basta apenas executar:

```bash
$ docker-compose up -d
```

### Testes
Para executar os teste automatizados basta rodar um dos seguintes comandos:

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```