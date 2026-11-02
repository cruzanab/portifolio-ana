# Portfólio

Portfólio pessoal criado com React, Vite e React Router.

## Executar

```sh
npm install
npm run dev
```

## Verificações

```sh
npm run lint
npm test
npm run build
```

## Estrutura e convenções

- `src/components/`: componentes reutilizáveis da interface, em PascalCase.
- `src/pages/`: páginas e rotas.
- `src/context/`: estado compartilhado da aplicação.
- `src/utils/`: funções auxiliares e validação.
- Use nomes em camelCase para variáveis e funções; hooks começam com `use`.
- Mantenha dados dos projetos e configuração das rotas em `src/main.jsx`.
- Rode ESLint e testes antes de integrar alterações; o hook de commit executa
  essas verificações automaticamente.

## Versionamento

- Use mensagens no padrão Conventional Commits, por exemplo
  `feat: adiciona status dos repositórios`.
- Desenvolva cada alteração em `feature/<nome>` ou `fix/<nome>` e integre por
  pull request na branch principal após lint e testes.
- O hook Husky em `.husky/pre-commit` executa `npm run lint` e `npm test`.
- Este workspace ainda não está inicializado como repositório Git; não há
  commits, branches ou publicação automática configurados.

## Contato e dashboard

O formulário valida nome, e-mail e tamanho mínimo da mensagem. Sem configurar o
Firebase, as mensagens e projetos em destaque ficam no `localStorage` deste
navegador e o formulário oferece um link `mailto` como alternativa.

Sem configurar Firebase, a aplicação mantém o modo local demonstrativo. Ele usa
a senha `portfolio-demo`, não envia e-mail e **não oferece autenticação segura**.

Com Firebase configurado, o formulário salva as mensagens no Firestore e chama
uma Cloud Function que envia o e-mail pelo Resend. O dashboard usa Firebase
Authentication, lê as mensagens em tempo real e permite marcar respostas e
selecionar destaques. As regras do Firestore limitam o acesso ao e-mail verificado
`anabcruzsilva@gmail.com`; altere essa regra caso a conta proprietária seja outra.

### Configuração do Firebase

1. Crie um projeto Firebase, adicione um app Web e ative Authentication com
   e-mail/senha e o Cloud Firestore.
2. Copie `.env.example` para `.env` e preencha as configurações Web do Firebase.
   Esses valores identificam o app; não coloque chaves administrativas nesse
   arquivo.
3. Crie a conta proprietária no Firebase Authentication e verifique o e-mail.
   A aplicação não oferece cadastro público.
4. Instale o Firebase CLI, autentique com `firebase login`, selecione o projeto
   com `firebase use --add` e configure a chave do Resend com
   `firebase functions:secrets:set RESEND_API_KEY`.
5. Verifique um domínio no Resend e configure `CONTACT_FROM_EMAIL` e
   `CONTACT_TO_EMAIL` quando o Firebase CLI solicitar na primeira publicação
   das funções. Nunca use ou envie essas credenciais no código do navegador.
6. Publique regras e função com
   `firebase deploy --only firestore:rules,functions`.
7. No Firestore, configure TTL para o campo `expiresAt` da coleção
   `contactRateLimits` para remover os registros temporários do limite de envios.
8. Execute `npm run dev` e teste o formulário e o login com a conta proprietária.

O envio real depende de um projeto Firebase, de um domínio verificado no Resend
e da configuração de cobrança exigida pelo Firebase para Cloud Functions. Sem
essas configurações, o projeto continua funcionando em modo local e informa que
mensagens não são enviadas.

Quando quiser publicar o site no Firebase Hosting, execute `npm run build` e
`firebase deploy --only hosting`. A reescrita para `index.html` já está configurada
para manter o acesso direto às rotas do React Router.

## Dados públicos do GitHub

Os cards e detalhes consultam a API pública do GitHub para exibir linguagem,
estrelas e data da última atualização dos repositórios vinculados. A consulta
é feita pelo navegador, sem token e sem criar uma API própria; os resultados
ficam em cache durante a sessão para reduzir chamadas. A API sem autenticação
tem limite de requisições e não consegue acessar repositórios privados. Projetos
sem um link real de repositório aparecem como não vinculados. Atualmente, somente
o repositório público do Synesthesia está associado; os demais não são consultados.

## Rotas diretas

As rotas do React Router precisam ser encaminhadas para `index.html` pelo
servidor de hospedagem para que links diretos e atualização funcionem após o
deploy.
