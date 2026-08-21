# UTM Generator — Instalação no Google Sheets

Gerador de UTMs com autopreenchimento de `utm_source`/`utm_medium` por plataforma, URL-encoding automático, `https://` automático e log de cada UTM com timestamp.

## Arquivos

| Arquivo | Onde colar |
|---|---|
| `Code.gs` | Editor Apps Script → arquivo `Código.gs` |
| `Sidebar.html` | Editor Apps Script → `+` → HTML → renomear `Sidebar` |

## Passo a passo

1. Abra a planilha no Google Sheets.
2. Menu **Extensões → Apps Script**.
3. No editor, apague o conteúdo de `Código.gs` e cole o conteúdo de `Code.gs`.
4. Clique no **`+`** ao lado de "Arquivos" → **HTML** → nomeie como `Sidebar` (exato, sem extensão `.html`) → cole o conteúdo de `Sidebar.html`.
5. Salve (Ctrl+S) → dê autorização quando pedir.
6. Volte à planilha e recarregue a página (F5).
7. Menu **UTM Generator → Abrir gerador** — abre a sidebar.

> Na primeira execução, as abas **Instruções**, **Config** e **Log** são criadas automaticamente. A aba **Instruções** explica o funcionamento da automação direto na planilha.

## Abas criadas

### Instruções (esta aba)
Guia gerado automaticamente explicando o que a automação faz, como usar (5 passos), o que entra no link automaticamente e como personalizar. Acesso: menu **UTM Generator → Ver instruções**. Fica sempre na **primeira aba** e é **recriada automaticamente** se for apagada.

Inclui a seção **"Como a automação considera cada UTM"**, com o tratamento de cada parâmetro: se entra sempre ou só quando preenchido, quando é obrigatório (pela Config), a ordem fixa do link, as transformações (minúsculas/símbolos) e a exceção das variáveis `{token}` de plataforma. Se você já tinha a aba de uma instalação anterior, **apague a aba Instruções e reabra o gerador** para recriá-la com a nova seção.

### Config (regras editáveis)

**Configurações gerais** (topo):
| A | B | C |
|---|---|---|
| UTMs em minúsculo | SIM / NAO | Converte todos os valores de UTM para minúsculas |
| Tirar caracteres especiais | SIM / NAO | Remove acentos e símbolos (viram `_`) |

**Tabela por plataforma**:
| Plataforma | utm_source (auto) | utm_medium (auto) | utm_campaign obrig? | utm_content obrig? | utm_term obrig? | utm_id obrig? |
|---|---|---|---|---|---|---|
| Facebook Ads | facebook | social | SIM | (vazio) | (vazio) | (vazio) |
| TikTok Ads | tiktok | social | SIM | (vazio) | (vazio) | (vazio) |
| Google Ads | google | cpc | SIM | (vazio) | (vazio) | (vazio) |
| Influenciadores | @[nome] | social | SIM | (vazio) | (vazio) | (vazio) |

- Marque **SIM** numa coluna "obrig?" para o link **não gerar** se o campo estiver vazio (avisa qual falta).
- Deixe em branco para tratar o campo como **opcional** (omitido do link se vazio).
- `utm_source`/`utm_medium` sempre vão no link (autogerados).
- O valor `[nome]` no Influenciadores usa o campo "Nome do influenciador" (sem `@`), virando `utm_source` (ex: `fulano`).
- Para usar o "nome do influenciador" numa nova plataforma, coloque `[nome]` na coluna utm_source.
- Adicionar mais linhas/plataformas as torna disponíveis no dropdown da sidebar.
- `@` é proibido — user digita o nome do influenciador sem `@`.

### Log (histórico automático)
Cada UTM gerada grava uma linha nova no topo:
`Timestamp | Plataforma | URL base | utm_source | utm_medium | utm_campaign | utm_content | utm_term | utm_id | Observações | Link UTM completo`

## Como usar

1. Selecione a **plataforma**.
2. (Influenciadores) digite o **nome do criador**.
3. Digite a **URL base** — não precisa incluir `https://`, é adicionado automaticamente.
4. Digite **campanha/produto**, e opcionalmente `utm_content`, `utm_term`, `utm_id`, observações.
5. **Gerar UTM** → link pronto aparece com botão **Copiar**.
6. A UTM já sai gravada no **Log** com timestamp — sem botão de salvar.

- **Aviso de obrigatório**: se um campo marcado como obrigatório estiver vazio, ele fica vermelho com aviso no painel (sem depender de erro genérico do servidor).
- **Confirmação manual**: ao gerar, aparece um alerta pedindo para confirmar manualmente o link UTM antes de veicular.

## Como servem as variáveis de plataforma

O **utm_id** tem o check "Preenchimento automático de plataforma". Marcando, abre um dropdown com os tokens dinâmicos da plataforma escolhida:
- **Facebook Ads**: `{campaign.id}`, `{adset.id}`, `{ad.id}`, `{placement}`, etc.
- **Google Ads**: `{campaignid}`, `{adgroupid}`, `{creative}`, `{keyword}`, etc. (ValueTrack)
- **TikTok Ads**: `{campaign_id}`, `{adgroup_id}`, `{ad_id}`, `{creative_id}`, etc.
- **Influenciadores**: sem variáveis (dropdown oculto).
- As variáveis `{...}` são **preservadas** (não sofrem minúsculas/saneamento) e a plataforma substitui pelo valor real quando o anúncio roda.

## Layout do painel
- **Observações** fica em linha própria, abaixo de todos os campos.
- **utm_id** fica em linha própria (sem dividir com outro campo), com campo maior + check de preenchimento automático logo abaixo.
- Painel mais largo (560px) pra não cortar texto dos botões.

## Regras de comportamento

- **`https://` automático**: se a URL base não começar com protocolo (`http://`, `https://`), adiciona `https://`.
- **Ordem fixa** dos parâmetros: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `utm_id`.
- **Campos opcionais vazios são omitidos**; campos marcados **obrigatórios** no Config bloqueiam a geração se vazios.
- **Minúsculas / remoção de símbolos**: conforme as configurações gerais (B2/B3 do Config). Espaços, acentos e símbolos viram `_`.
- **URL-encoding automático**: valores com `&`, `?`, `#` são codificados — não quebram o link.
- **Avisos proativos**: na sidebar, cada campo avisa em tempo real como o valor será transformado (ex: "Será gerado como: produto_x").
- **Bloqueio de caracteres perigosos**: `& ? # % ' " = < > @` não entram nos campos — são removidos na hora e um aviso aparece. Na automação, o `@` do nome do influenciador também é removido.
- **Variáveis de plataforma no utm_id**: via check "Preenchimento automático de plataforma" (ver seção acima).
- Se a URL base já contém `?`, o gerador usa `&` em vez de `?` para os parâmetros.

## Solução de problemas

- **Sidebar não abre**: recarregue a planilha e tente de novo.
- **Autorização**: na primeira execução, conceda permissões (o script usa o Sheets ativo).
- **Header do Log em branco**: garantido na linha 1 a cada execução; se apagar, é recriado.
