# Sala Certa CNA

Sistema web para organizar a distribuição de turmas, professores e salas da CNA, com painel administrativo e uma tela pública preparada para exibição em TV.

## Funcionalidades

- Cadastro, edição e exclusão de turmas.
- Organização por andar e sala.
- Registro de professor, turma/disciplina, quantidade de alunos e horário de início e término da aula.
- Busca e filtro por andar.
- Indicadores de turmas, salas ocupadas e alunos.
- Tela de TV agrupada por andar, com relógio e data.
- Layout responsivo.
- Persistência local com `localStorage`.
- Atualização entre abas do mesmo navegador.

## Tecnologias

- HTML5
- CSS3
- JavaScript puro (Vanilla JS)

## Como executar

1. Clone ou baixe este repositório.
2. Abra `index.html` em um navegador.
3. Cadastre as turmas no painel de gerenciamento.
4. Selecione **Tela da TV** para exibir a distribuição.

Não há dependências para instalar.

## Telas

- `index.html#admin` — gerenciamento das turmas.
- `index.html#tv` — painel para TV.

## Armazenamento

Os dados são armazenados no navegador usando `localStorage`. A sincronização funciona entre abas do mesmo navegador. Para compartilhar dados entre computadores ou TVs diferentes, será necessário integrar um backend, como Supabase.

## Melhorias futuras

- Banco de dados remoto e sincronização em tempo real.
- Login para administradores.
- Cadastro de horários e períodos.
- Validação de conflitos por sala e horário.

---

Projeto educacional da CNA.

## Identidade visual

Interface com a paleta vermelha da CNA e marca sobre fundo branco.
