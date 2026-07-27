# Modelo de Segurança

## Princípios

O Portal de Yppon deve tratar dados fictícios como dados governamentais reais. A
segurança deve ser pensada desde o início, mesmo quando a primeira versão ainda
usa dados locais ou fixtures.

Princípios iniciais:

- minimizar dados expostos;
- validar entradas e saídas com schemas runtime;
- separar entidades internas de DTOs públicos;
- negar acesso por padrão;
- auditar ações sensíveis;
- evitar dados pessoais em logs;
- manter documentos rastreáveis;
- preservar histórico de publicações.

## Classes de Dados

Público:

- leis;
- editais;
- atos oficiais;
- páginas institucionais;
- calendário público;
- formações públicas.

Privado do cidadão:

- Registro Global para Cidadãos;
- Autorização de Acesso;
- diplomas;
- diário universitário;
- histórico, frequência e matrículas;
- dados biológicos e genéticos.

Operacional:

- contas administrativas;
- identificações profissionais;
- tokens profissionais;
- chaves virtuais;
- logs de auditoria;
- metadados de publicação.

## Acesso

Cidadãos podem consultar documentos próprios privados e documentos públicos. Eles
não podem emitir, alterar ou recuperar documentos pelo portal.

Administradores possuem controle global no primeiro escopo, mas todo acesso
administrativo deve ser auditável. A estrutura deve permitir evolução para
permissões por instituição, recurso e ação.

Máquinas presenciais podem executar fluxos operacionais específicos. Esse modelo
deve ser tratado como um tipo próprio de ator ou contexto de confiança quando a
API existir.

## Autenticação

Cidadão:

- identidade civil;
- token de acesso;
- recuperação apenas presencial.

Administrador:

- identificação profissional;
- token profissional;
- chave virtual;
- auditoria obrigatória;
- potencial sessão curta e renovação explícita.

## Auditoria

Eventos de auditoria devem registrar:

- identificador do ator;
- tipo do ator;
- ação;
- recurso;
- escopo institucional;
- data e hora;
- origem técnica quando aplicável;
- resultado;
- identificador de correlação.

Eventos não devem registrar:

- tokens;
- chaves virtuais;
- dados biológicos;
- documentos completos;
- anexos;
- endereços completos;
- informações médicas.

### Política técnica de logging

Logs operacionais da API podem conter:

- `requestId`;
- método e caminho HTTP sem query string;
- status da resposta;
- endereço e porta remotos quando necessários à operação;
- nome e código técnico de erros;
- contexto de validação sem valores recebidos;
- duração e horário gerados pelo logger.

Logs operacionais não podem conter:

- cabeçalhos de autorização ou cookies;
- query strings;
- corpos de requisição ou resposta;
- mensagens e stacks de erros que possam carregar valores internos;
- senhas, tokens, chaves virtuais ou URLs de banco;
- documentos, anexos ou dados pessoais.

A redação é aplicada em desenvolvimento e produção. `API_LOG_LEVEL` controla
volume, não a política de dados. Novos campos precisam de revisão explícita; não
se deve ampliar serializers ou registrar objetos de request, reply ou error
inteiros.

## Riscos Iniciais

- Construir API sem contratos runtime.
- Retornar entidade de banco diretamente para o frontend.
- Misturar Diário Oficial com cópias institucionais divergentes.
- Não separar documento público de documento privado.
- Logar conteúdo sensível por acidente.
- Criar admin global sem trilha de auditoria.
- Deixar line endings e formatação causarem diffs massivos.
- Armazenar anexos sem estratégia de verificação, tamanho, tipo e acesso.

Exceções temporárias de supply chain ficam no
[registro de segurança de dependências](../project/dependency-security-exceptions.md)
e exigem responsável, controles compensatórios e prazo de revisão.

## Decisões Pendentes

- formato exato da chave virtual administrativa;
- duração e renovação de sessões;
- política de retenção de logs;
- modelo de assinatura/verificação documental;
- estratégia de armazenamento de anexos;
- nível inicial de granularidade das permissões;
- modelo de inscrições em processos seletivos.
