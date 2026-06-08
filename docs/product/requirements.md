# Requisitos do Portal de Yppon

## Visão

O Portal de Yppon é um portal institucional público com linguagem e confiança de
serviço governamental. Embora Yppon seja fictício, o sistema deve ser projetado
como se atendesse milhões de cidadãos e processasse dados pessoais sensíveis.

O foco não é criar apenas uma vitrine narrativa. O portal deve ter realismo de
arquitetura, segurança, rastreabilidade e organização institucional.

## Escopo Institucional

Yppon possui instituições com diferentes graus de autonomia. Legislativo e
Judiciário são os poderes superiores, com autoridade equivalente. A Autoridade
de Segurança está abaixo deles, e a Autoridade de Migração está abaixo da
Autoridade de Segurança. A IUGY é a universidade única do Estado, com natureza
institucional própria.

Subportais iniciais:

- IUGY.
- Judiciário.
- Legislativo.
- Autoridade de Segurança.
- Autoridade de Migração.
- Diário Oficial.
- Biblioteca Constitucional.

Cada subportal deve ter página pública e, quando aplicável, serviços para
cidadãos autenticados. Instituições publicam documentos em seus próprios nomes,
mas o Diário Oficial é a fonte canônica de documentos oficiais. Páginas
institucionais devem apontar para documentos publicados no Diário Oficial.

## Cidadãos e Identidade

O portal não cadastra cidadãos diretamente. Registros civis, alterações,
recuperações e emissão de documentos ocorrem em pontos oficiais presenciais ou
terminais de autoatendimento. O portal consulta e exibe informações já
registradas.

Todos os usuários civis acessam como cidadão. Perfis funcionais mais detalhados
podem existir no futuro, mas não fazem parte do primeiro escopo.

Documentos de identidade:

- Registro Global para Cidadãos, usado por cidadãos de Yppon.
- Autorização de Acesso, usada por estrangeiros, podendo ser temporária ou
  permanente.

Dados pessoais previstos:

- nome civil;
- data de nascimento;
- número de registro ou autorização;
- origem;
- endereço;
- vínculo profissional;
- tipo sanguíneo;
- presença de genes aetherium;
- doenças crônicas;
- sexo.

Esses dados devem ser tratados como sensíveis mesmo quando fictícios.

## Documentos

Documentos podem ser públicos ou privados do cidadão. Não há, no escopo inicial,
uma terceira classificação operacional para documentos restritos a servidores,
embora a arquitetura não deva impedir essa evolução.

Documentos públicos incluem leis, editais e publicações oficiais similares.
Documentos privados incluem identidade civil, autorizações, diplomas e diário
universitário com histórico, frequência e matrículas.

Regras:

- documentos não devem sumir;
- documentos podem ser corrigidos, substituídos, perder vigência ou ser
  arquivados;
- correções devem preservar rastreabilidade e exibição de diferenças;
- documentos precisam de assinatura, selo ou mecanismo de verificação oficial;
- anexos entram no escopo inicial;
- documentos publicados permanecem pesquisáveis historicamente.

## Diário Oficial

O Diário Oficial é a fonte canônica para documentos oficiais. Subportais
institucionais exibem atalhos e destaques, mas a publicação oficial vive no
Diário Oficial.

Publicações são feitas por usuário administrador representando o governo como
entidade administrativa. No escopo inicial não há fluxo formal de revisão entre
autor, revisor e publicador.

Documentos podem declarar validade, vigência ou efeito legal em seu conteúdo,
mas permanecem disponíveis para consulta.

## IUGY

A IUGY permanece como primeiro domínio real da API. Os dados atuais da página
IUGY devem ser tratados como base oficial inicial, não apenas demonstração.

Escopo da IUGY:

- informações institucionais públicas;
- formações;
- editais;
- calendário público;
- documentos oficiais;
- inscrições em processos seletivos quando necessário.

Fora do escopo atual:

- área estudantil completa;
- ambiente de estudos;
- matrículas operacionais;
- funcionalidades equivalentes a Moodle.

Editais da IUGY devem seguir a regra do Diário Oficial: a página da IUGY pode
destacar e facilitar acesso, mas a publicação oficial deve apontar para o
documento canônico.

## Administração

Haverá painel administrativo. Para controlar o escopo inicial, existirá um admin
global com acesso total ao sistema.

A arquitetura deve permitir evolução posterior para permissões mais granulares,
com papel, escopo, ação e recurso.

Administradores podem representar funções institucionais como:

- presidência do Senado;
- juiz superior;
- reitoria da IUGY;
- liderança da comissão que controla a Autoridade de Segurança;
- liderança da comissão que controla a Autoridade de Migração.

Entradas operacionais podem ocorrer em máquinas institucionais presenciais, como
postos na Ilha de Shelly para Autorizações de Acesso ou pontos da IUGY para
publicação de editais.

## Autenticação

Cidadãos autenticam com identidade civil e token de acesso. O token funciona
como senha vinculada à pessoa e só pode ser criado, alterado ou recuperado em
pontos oficiais presenciais ou terminais de autoatendimento.

Administradores autenticam com:

- identificação profissional;
- token de acesso profissional;
- verificação de chave virtual, simulando um arquivo de segurança físico.

Administradores devem ter autenticação em dois ou mais fatores.

## Auditoria

Todas as ações sensíveis devem ser auditadas, incluindo:

- login;
- acesso de documentos privados;
- inscrições;
- publicações oficiais;
- alterações administrativas;
- alterações de permissão;
- correções, substituições e arquivamentos de documentos.

Logs não devem conter dados pessoais sensíveis. Devem registrar referências
mínimas, identificadores internos, ator, ação, recurso, horário e resultado.

## Direção de Arquitetura

A prioridade é arquitetura realista, não entrega rápida de features visuais.

Direção recomendada:

- corrigir higiene de repositório e line endings;
- documentar requisitos e domínios;
- adotar Docker para desenvolvimento local;
- criar API modular em TypeScript com Fastify;
- usar TypeBox para schemas de transporte;
- usar PostgreSQL e Drizzle para persistência;
- adotar npm workspaces quando `apps/api` ou `packages/contracts` existir de
  fato;
- manter contratos compartilhados apenas quando web e API consumirem a mesma
  fronteira.
