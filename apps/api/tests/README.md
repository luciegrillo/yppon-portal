# Estratégia de Testes da API

`npm run test -w @yppon/api` executa a suíte automatizada da API. No CI, esse
comando roda depois de migrations e seed em PostgreSQL autenticado.

Testes de rotas HTTP usam `Fastify.inject()` por meio de
`tests/helpers/app.ts`, sem abrir porta local. Novas rotas devem validar status,
corpo público, `requestId`, erros de validação e mensagens sem detalhes
internos.

Testes de banco exigem `DATABASE_URL`. Cenários que alteram dados devem criar
registros próprios com identificadores únicos e limpar tudo em `finally`.
Enquanto não houver transações por teste, evite mutar fixtures compartilhadas ou
assumir ordem entre arquivos de teste.

Repositories e queries públicas devem ganhar testes de integração antes de
serem consumidos por endpoints. Endpoints autenticados, administrativos ou com
dados privados exigem cobertura de sucesso, negação de acesso, validação,
resposta pública de erro e expectativa de auditoria antes do merge.
