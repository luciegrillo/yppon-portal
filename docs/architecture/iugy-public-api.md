# API Pública da IUGY

A primeira fronteira pública de domínio da API expõe somente conteúdo publicado
da IUGY em URLs versionadas.

## Endpoints

| Método | Rota                                    | Resultado                     |
| ------ | --------------------------------------- | ----------------------------- |
| `GET`  | `/api/v1/iugy`                          | Instituição pública           |
| `GET`  | `/api/v1/iugy/programs`                 | Formações acadêmicas          |
| `GET`  | `/api/v1/iugy/notices`                  | Editais                       |
| `GET`  | `/api/v1/iugy/selection-cycles/current` | Ciclo seletivo vigente        |
| `GET`  | `/api/v1/iugy/events`                   | Eventos do calendário público |

Recursos individuais usam o envelope `{ "data": ... }`. Listagens usam
`{ "data": [...], "pagination": ... }`, com os metadados `page`, `pageSize`,
`totalItems` e `totalPages`.

## Paginação e ordenação

As três listagens aceitam `page`, `pageSize`, `sort` e `order`.

- `page` começa em `1`;
- `pageSize` usa `20` por padrão e aceita no máximo `100`;
- `page` usa `1` por padrão e aceita no máximo `10.000`, limitando offsets
  excessivos;
- `order` aceita `asc` ou `desc`;
- formações usam `displayOrder asc` por padrão e também podem ser ordenadas por
  `publishedAt` ou `title`;
- editais usam `publishedAt desc` por padrão e também podem ser ordenados por
  `code`, `status` ou `title`;
- eventos usam `displayOrder asc` por padrão e também podem ser ordenados por
  `publishedAt` ou `title`.

Todas as ordenações possuem o UUID como desempate, mantendo páginas estáveis.
Valores inválidos para os parâmetros reconhecidos retornam `400` no formato
público de erro.

## Visibilidade e ciclo vigente

As queries exigem simultaneamente:

- instituição com slug `iugy` e estado `published`;
- recurso com estado `published`.

Conteúdos `draft` e `archived` nunca são retornados. O ciclo vigente não é
inferido por número ou por existência de eventos: ele usa a marca `is_current`,
que só pode existir em um ciclo publicado e é única por instituição.

## Limites entre camadas

O módulo segue o fluxo `route -> application service -> repository`:

- rotas validam query strings e selecionam schemas TypeBox de resposta;
- o service aplica padrões de paginação e converte records em DTOs públicos;
- o repository projeta apenas campos permitidos e executa queries PostgreSQL;
- entidades Drizzle e campos internos de publicação não atravessam a fronteira
  HTTP.

Listagens consultam itens e total em transações `repeatable read` somente de
leitura. O repository pode ser injetado na aplicação para testes HTTP sem banco;
a aplicação em execução cria a implementação PostgreSQL e encerra a conexão no
shutdown.

Os contratos permanecem no módulo da API enquanto apenas ela os consome. A
extração para um workspace compartilhado deve acontecer somente quando a
integração web/API justificar a segunda consumidora.

## Erros

Erros públicos mantêm o envelope:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Parâmetros da requisição inválidos.",
    "requestId": "correlation-id"
  }
}
```

Recursos ausentes retornam `NOT_FOUND`. Falhas inesperadas retornam
`INTERNAL_ERROR` com mensagem genérica. Detalhes do PostgreSQL ou da aplicação
não atravessam a resposta e não são registrados por padrão; os logs preservam
somente metadados seguros definidos pela política de segurança.
