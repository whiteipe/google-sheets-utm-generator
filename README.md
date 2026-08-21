# Google Sheets UTM Generator

Gerador de URLs com parâmetros **UTM** para times de marketing, rodando direto no **Google Sheets**.

Monte links de campanha tagueados corretamente em segundos, sem erro manual, mantendo consistência e rastreamento para plataformas de analytics e mídia paga.

## O que faz

- Preenche `utm_source` e `utm_medium` automaticamente por plataforma.
- Monta a URL final completa com todos os campos UTM preenchidos.
- Adiciona `https://` automaticamente quando você não digita o protocolo.
- Normaliza valores (minúsculas, sem acentos/símbolos).
- Bloqueia caracteres que quebram a URL, com aviso em tempo real.
- **Log automático** de cada UTM gerada, com timestamp.
- **Painel lateral** intuitivo com avisos e variáveis dinâmicas por plataforma.
- Aba **Config** para ajustar regras por plataforma conforme suas preferências.
- Aba **Instruções** com guia passo a passo (gerada automaticamente).

## Instalação

1. No Google Sheets: **Extensões → Apps Script**.
2. Apague o conteúdo de `Código.gs` e cole o de **`Code.gs`**.
3. No editor, **`+` → HTML** → nomeie `Sidebar` → cole o de **`Sidebar.html`**.
4. Salve (Ctrl+S), autorize quando pedir e recarregue a planilha.
5. Menu **UTM Generator → Abrir gerador**.

## Como usar

1. Escolha a plataforma.
2. Digite a URL base (ex: `site.com.br/pagina`).
3. Preencha a campanha e os campos opcionais conforme precisar.
4. Clique em **Gerar UTM**, copie o link e confirme antes de publicar.

Cada geração fica registrada no **Log** com timestamp. Detalhes de funcionamento e regras de comportamento estão na aba **Instruções** dentro da planilha.

## Documentação

- **`INSTALACAO.md`** — passo a passo completo e regras de comportamento.
- **`DOCUMENTACAO.md`** — visão geral e contextualização do projeto.

## Licença

Confidencial / uso interno White Ipe.
