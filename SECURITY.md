# Política de Segurança

O Portal de Yppon é fictício, mas o desenvolvimento deve tratar dados civis,
documentos e fluxos administrativos como sistemas governamentais reais.

## Dados Sensíveis

São considerados sensíveis:

- documentos privados de cidadãos;
- Registro Global para Cidadãos;
- Autorizações de Acesso;
- dados biológicos, genéticos ou médicos;
- tokens de acesso;
- chaves virtuais;
- identificações profissionais;
- logs de auditoria;
- anexos privados.

Esses dados não devem aparecer em commits, fixtures públicas, screenshots, logs
ou mensagens de erro.

## Segredos

Arquivos `.env` e `.env.*` são ignorados pelo Git. Quando API e banco entrarem,
o repositório deve manter apenas `.env.example`, sem valores reais.

Nunca commite:

- credenciais;
- tokens;
- certificados;
- dumps de banco;
- arquivos de chave virtual;
- anexos privados.

## Logs e Auditoria

Logs técnicos não devem conter dados pessoais, documentos completos, tokens,
chaves virtuais ou anexos. Eventos de auditoria devem registrar apenas
identificadores mínimos, ator, ação, recurso, escopo, horário e resultado.

Ações sensíveis devem ser auditáveis:

- login;
- leitura de documentos privados;
- publicações oficiais;
- inscrições;
- alterações administrativas;
- alterações de permissão;
- correções e arquivamentos de documentos.

## API e Persistência

Quando a API for introduzida:

- validar entrada e saída com schemas runtime;
- não retornar entidades de banco diretamente;
- separar documentos públicos e privados desde o modelo;
- negar acesso por padrão;
- padronizar erros sem vazar detalhes internos;
- usar migrations versionadas;
- manter seeds claramente fictícias.

## Reporte Interno

Problemas de segurança devem ser registrados como issues privadas ou comunicados
diretamente à pessoa responsável pelo repositório antes de qualquer divulgação
pública. Enquanto o projeto for fechado, não há programa público de disclosure.

Use o template de issue de segurança apenas quando o problema puder ser descrito
sem expor segredos ou dados sensíveis.
