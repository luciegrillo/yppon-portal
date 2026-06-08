# Modelo Público da IUGY

Este documento registra a primeira camada persistente da IUGY. O escopo é
somente conteúdo público institucional e acadêmico; cidadãos, autenticação,
administração, anexos privados e Diário Oficial completo permanecem fora deste
modelo inicial.

## Entidades

- `institutions`: cadastro institucional público. A IUGY é a primeira
  instituição persistida.
- `iugy_academic_formations`: níveis/formações exibidos no subportal da IUGY.
- `iugy_selection_cycles`: ciclos acadêmicos usados por editais e calendário.
- `iugy_notices`: editais públicos da IUGY.
- `iugy_calendar_events`: eventos públicos do calendário acadêmico.
- `official_documents`: documentos oficiais públicos destacados por uma
  instituição.

Todas as tabelas usam UUID, `created_at`, `updated_at`, `published_at`,
`archived_at` e `publication_state`.

## Estados

`publication_state` controla visibilidade pública:

- `draft`: conteúdo em preparação;
- `published`: conteúdo disponível para consulta pública;
- `archived`: conteúdo arquivado sem exclusão histórica.

Estados de domínio são separados da publicação. Um edital pode estar
`published` e ter status `encerrado`. Um documento pode estar `published` e
ter status `preparacao` quando a página pública informa que o documento está em
preparação.

## Relações e Índices

- Formações, ciclos, editais, calendário e documentos pertencem a uma
  instituição.
- Editais podem apontar para uma formação e sempre apontam para um ciclo.
- Eventos de calendário sempre apontam para um ciclo.
- FKs usam `ON DELETE RESTRICT` para evitar perda acidental de histórico.
- Índices cobrem slugs/códigos únicos, FKs e consultas públicas por estado de
  publicação.

O modelo interno da API não deve ser retornado diretamente ao frontend. DTOs e
schemas TypeBox públicos serão definidos quando os endpoints da issue #1 forem
implementados.
