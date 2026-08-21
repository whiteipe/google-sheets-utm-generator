# google-sheets-utm-generator

Gerador de URLs com parâmetros **UTM** para times de marketing, rodando dentro do **Google Sheets** via **Apps Script**. Uma ferramenta interativa que economiza o tempo do time: escolhe a plataforma, preenche os campos, e o link UTM pronto sai com um clique — já gravado no log com timestamp.

## O que faz

- Preenche `utm_source` / `utm_medium` **automaticamente** por plataforma (Facebook Ads, TikTok Ads, Google Ads, Influenciadores).
- Monta a URL final com `utm_campaign`, `utm_content`, `utm_term` e `utm_id` (apenas os preenchidos).
- Adiciona `https://` automaticamente se você não digitar o protocolo.
- Normaliza os valores: minúsculas e remoção de acentos/símbolos (configurável).
- Bloqueia caracteres que quebram a URL (`& ? # % = < > @`) com aviso em tempo real.
- **Log automático** de cada UTM gerada, com timestamp.
- **Painel lateral** (sidebar) intuitivo, com:
  - avisos proativos mostrando como o valor será transformado;
  - variáveis dinâmicas de plataforma no `utm_id` (ex: `{campaign_id}`, `{campaignid}`, `{ad.id}`);
  - alerta para confirmar manualmente o link antes de veicular.
- Aba **Config** editável: define regras por plataforma, obrigatórios vs. opcionais, e preferências globais.
- Aba **Instruções** gerada automaticamente, explicando o funcionamento.

## Para que serve

Time de marketing cria links de campanha com tagueamento correto em segundos, sem erro manual, mantendo consistência e rastreamento fiel no Analytics/GA4.

## Instalação

1. No Google Sheets: **Extensões → Apps Script**.
2. Apague o conteúdo de `Código.gs` e cole o de **`Code.gs`**.
3. No editor, **`+` → HTML** → nomeie `Sidebar` → cole o de **`Sidebar.html`**.
4. Salve (Ctrl+S), autorize quando pedir e recarregue a planilha.
5. Menu **UTM Generator → Abrir gerador**.

## Como usar

1. Escolha a plataforma.
2. (Influenciadores) digite o nome do criador — **sem `@`**.
3. Digite a URL base (ex: `site.com.br/pagina`). O `https://` entra sozinho.
4. Preencha a campanha e os opcionais conforme precisar (`utm_content`, `utm_term`, `utm_id` + checkbox de variáveis).
5. Clique em **Gerar UTM**, copie o link e confirme manualmente antes de publicar.

Cada geração já sai gravada no **Log** com timestamp.

## Documentação

- **`INSTALACAO.md`** — passo a passo completo e regras de comportamento.
- **`DOCUMENTACAO.md`** — visão geral e como o projeto se relaciona com o site da White Ipe.
- Dentro da planilha, a aba **Instruções** guia o usuário final.

## Licença

Confidencial / uso interno White Ipe.
