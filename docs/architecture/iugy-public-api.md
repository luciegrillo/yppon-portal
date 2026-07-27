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

As três listagens aceitam `page`, `pageSize`, `sort` e `order`. Eventos também
aceitam `current`.

- `page` usa `1` por padrão e aceita no máximo `10.000`, limitando offsets
  excessivos;
- `pageSize` usa `20` por padrão e aceita no máximo `100`;
- `order` aceita `asc` ou `desc`;
- formações usam `displayOrder asc` por padrão e também podem ser ordenadas por
  `publishedAt` ou `title`;
- editais usam `publishedAt desc` por padrão e também podem ser ordenados por
  `code`, `status` ou `title`;
- eventos usam `displayOrder asc` por padrão e também podem ser ordenados por
  `publishedAt` ou `title`.
- `current=true` limita eventos ao ciclo explicitamente vigente e publicado.
  Isso permite que o portal carregue ciclo e calendário em paralelo, sem uma
  cascata de requisições nem filtragem incompleta depois da paginação.

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

A migration inicial identifica o ciclo canônico pelos dados de domínio
`institutions.slug = iugy` e `cycle_number = 1988`, sem depender dos UUIDs
fictícios usados pelo seed.

Chaves estrangeiras compostas garantem que editais e eventos só referenciem
formações e ciclos pertencentes à mesma instituição.

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

Os DTOs e envelopes públicos vivem em `@yppon/contracts` e são consumidos pela
API e pelo frontend. Os schemas TypeBox permanecem na fronteira HTTP da API e
possuem asserções de tipo exatas contra o pacote compartilhado, evitando
duplicação e divergência sem levar validação do servidor ao bundle do navegador.

## Integração web

A página pública inicia em paralelo as cinco leituras da IUGY: instituição,
formações, editais, ciclo vigente e eventos do ciclo vigente. Listagens pedem a
primeira página com até 100 itens para evitar cascatas automáticas; quando o
total publicado ultrapassa esse limite, a interface informa quantos registros
estão sendo exibidos. Cada recurso tem estados acessíveis de carregamento,
ausência e erro, além de repetição isolada da requisição que falhou.

O cliente usa URLs relativas sob `/api`. O Vite encaminha esse prefixo para
`127.0.0.1:3333` no desenvolvimento; a implantação deve oferecer o mesmo
encaminhamento na origem pública.

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
