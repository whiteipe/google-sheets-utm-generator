var CFG = 'Config';
var LOG = 'Log';
var HELP = 'Instruções';
var PLATFORMS = ['Facebook Ads', 'TikTok Ads', 'Google Ads', 'Influenciadores'];

var PARAMS = ['utm_campaign', 'utm_content', 'utm_term', 'utm_id'];
var COL_CFG = {
  PLAT: 1,
  SOURCE: 2,
  MEDIUM: 3,
  // obrigatoriedade por parâmetro (colunas relativas à tabela de plataformas)
  OBRIG: { utm_campaign: 4, utm_content: 5, utm_term: 6, utm_id: 7 }
};
var CFG_HEADER_ROW = 6;         // linha dos headers da tabela de plataformas
var CFG_DATA_ROW = 7;           // primeira linha de dados

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('UTM Generator')
    .addItem('Abrir gerador', 'openSidebar')
    .addSeparator()
    .addItem('Ver instruções', 'gotoHelp')
    .addItem('Ver log', 'gotoLog')
    .addItem('Configurar regras', 'gotoConfig')
    .addToUi();
}

function openSidebar() {
  ensureSheets();
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('Gerador de UTM')
    .setWidth(560);
  SpreadsheetApp.getUi().showSidebar(html);
}

function gotoLog() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = ss.getSheetByName(LOG);
  if (s) ss.setActiveSheet(s);
}

function gotoConfig() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = ss.getSheetByName(CFG);
  if (s) ss.setActiveSheet(s);
}

function gotoHelp() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = ss.getSheetByName(HELP);
  if (s) ss.setActiveSheet(s);
}

function ensureSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureHelp(ss);
  ensureConfig(ss);
  ensureLog(ss);
}

function ensureHelp(ss) {
  var help = ss.getSheetByName(HELP);
  if (!help) {
    help = ss.insertSheet(HELP, 0);
    help.getRange('A1').setValue('Como funciona esta automação').setFontSize(16).setFontWeight('bold');
    addHelpRows(help);
    help.setColumnWidth(1, 640);
  }
  var first = ss.getSheets()[0];
  if (first.getName() !== HELP) ss.moveActiveSheet(0);
}

function ensureConfig(ss) {
  var cfg = ss.getSheetByName(CFG);
  if (!cfg) {
    cfg = ss.insertSheet(CFG);
    cfg.getRange('A1').setValue('Configurações gerais').setFontSize(14).setFontWeight('bold');
    cfg.getRange('A2').setValue('UTMs em minúsculo').setFontWeight('bold');
    cfg.getRange('B2').setValue('SIM').setFontWeight('bold');
    cfg.getRange('C2').setValue('Converte todos os valores de UTM para letras minúsculas (SIM/NAO)');
    cfg.getRange('A3').setValue('Tirar caracteres especiais').setFontWeight('bold');
    cfg.getRange('B3').setValue('SIM').setFontWeight('bold');
    cfg.getRange('C3').setValue('Remove acentos e símbolos dos valores (SIM/NAO)');
    buildConfigTable(cfg);
  }
  // garante larguras + dropdown toda execução (funciona também em Config pré-existente)
  cfg.setColumnWidth(1, 240);
  cfg.setColumnWidth(2, 130);
  cfg.setColumnWidth(3, 300);
  cfg.setColumnWidth(4, 170);
  cfg.setColumnWidth(5, 170);
  cfg.setColumnWidth(6, 150);
  cfg.setColumnWidth(7, 120);
  cfg.getRange('A1:B3').setHorizontalAlignment('center');
  addSimNaoDropdown(cfg);
  // migração: placeholder de influenciador sem @
  var last = Math.max(cfg.getLastRow(), CFG_DATA_ROW);
  var srcCol = cfg.getRange(CFG_DATA_ROW, COL_CFG.SOURCE, last - CFG_DATA_ROW + 1, 1);
  var srcVals = srcCol.getValues();
  var changed = false;
  for (var r = 0; r < srcVals.length; r++) {
    if (String(srcVals[r][0]).trim() === '@[nome]') {
      srcVals[r][0] = '[nome]';
      changed = true;
    }
  }
  if (changed) srcCol.setValues(srcVals);
  if (last >= CFG_DATA_ROW) {
    cfg.getRange('D' + CFG_HEADER_ROW + ':G' + last).setVerticalAlignment('middle');
  }
}

function addSimNaoDropdown(cfg) {
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['SIM', 'NAO'], true)
    .setAllowInvalid(false)
    .build();
  // configurações gerais B2:B3
  cfg.getRange('B2:B3').setDataValidation(rule);
  // tabela obrigatórios D:G (dados a partir da linha CFG_DATA_ROW)
  var lastRow = Math.max(cfg.getLastRow(), CFG_DATA_ROW);
  if (lastRow >= CFG_DATA_ROW) {
    cfg.getRange('D' + CFG_DATA_ROW + ':G' + lastRow).setDataValidation(rule);
  }
}

function buildConfigTable(cfg) {
  cfg.getRange(CFG_HEADER_ROW, 1, 1, 7).setValues([[
    'Plataforma', 'utm_source (auto)', 'utm_medium (auto)',
    'utm_campaign obrig?', 'utm_content obrig?', 'utm_term obrig?', 'utm_id obrig?'
  ]]).setFontWeight('bold');
  var data = [
    [PLATFORMS[0], 'facebook', 'social', 'SIM', null, null, null],
    [PLATFORMS[1], 'tiktok', 'social', 'SIM', null, null, null],
    [PLATFORMS[2], 'google', 'cpc', 'SIM', null, null, null],
    [PLATFORMS[3], '[nome]', 'social', 'SIM', null, null, null]
  ];
  cfg.getRange(CFG_DATA_ROW, 1, data.length, 7).setValues(data);
  for (var r = CFG_DATA_ROW; r < CFG_DATA_ROW + data.length; r++) {
    cfg.getRange(r, 1, 1, 7).setHorizontalAlignment('center');
  }
  cfg.getRange('D' + CFG_HEADER_ROW + ':G' + CFG_HEADER_ROW)
    .setBackground('#fff2cc')
    .setVerticalAlignment('middle');
}

function ensureLog(ss) {
  var log = ss.getSheetByName(LOG);
  if (!log) {
    log = ss.insertSheet(LOG);
    log.setFrozenRows(1);
  }
  // garante header sempre na linha 1
  var headers = [
    'Timestamp', 'Plataforma', 'URL base', 'utm_source', 'utm_medium',
    'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'Observações', 'Link UTM completo'
  ];
  var existing = log.getRange(1, 1, 1, headers.length).getValues()[0];
  var needsHeader = false;
  for (var i = 0; i < headers.length; i++) {
    if (String(existing[i]).trim() !== headers[i]) { needsHeader = true; break; }
  }
  if (needsHeader) {
    log.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    log.setFrozenRows(1);
  }
}

function getPlatforms() {
  ensureSheets();
  return PLATFORMS;
}

function getRules() {
  ensureSheets();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cfg = ss.getSheetByName(CFG);
  var out = { globals: { lower: true, sanitize: true }, platforms: {} };
  try {
    out.globals.lower = (String(cfg.getRange('B2').getValue()).toUpperCase() !== 'NAO');
    out.globals.sanitize = (String(cfg.getRange('B3').getValue()).toUpperCase() !== 'NAO');
  } catch (e) {}
  var lastRow = cfg.getLastRow();
  if (lastRow < CFG_DATA_ROW) return out;
  var data = cfg.getRange(CFG_DATA_ROW, 1, lastRow - CFG_DATA_ROW + 1, 7).getValues();
  for (var i = 0; i < data.length; i++) {
    var plat = String(data[i][0]).trim();
    if (!plat) continue;
    var rule = { source: data[i][1], medium: data[i][2], obrig: {} };
    var map = COL_CFG.OBRIG;
    PARAMS.forEach(function(p, k) {
      var cell = data[i][map[p] - 1];
      rule.obrig[p] = (String(cell).toUpperCase() === 'SIM');
    });
    out.platforms[plat] = rule;
  }
  return out;
}

function sanitizeValue(v, rules) {
  if (v == null || v === '') return '';
  var s = String(v).trim();
  // preserva placeholders de plataforma {ultimo.token}
  var tokens = s.match(/\{[a-zA-Z0-9_]+\}/g) || [];
  if (rules.globals.lower) {
    s = s.toLowerCase();
    tokens = tokens.map(function(t) { return t.toLowerCase(); });
  }
  if (rules.globals.sanitize) {
    s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    s = s.replace(/[^a-z0-9@._\-{}]+/g, '_');
  }
  // remove caracteres que quebram a URL (fora de placeholders)
  s = s.replace(/[?#%'\"=<>\\]+/g, '');
  return s;
}

function generateUrl(payload) {
  ensureSheets();
  var rules = getRules();
  var rule = rules.platforms[payload.platform] || {};

  var base = String(payload.base || '').replace(/\s/g, '')
    .replace(/^(?![a-z][a-z0-9+.-]*:\/\/)/i, 'https://');

  var source;
  var rawSource = String(payload.source || rule.source || '');
  if (rawSource.indexOf('[nome]') !== -1 && payload.influencer) {
    source = sanitizeValue(payload.influencer, rules);
  } else if (rawSource) {
    source = sanitizeValue(rawSource, rules);
  }
  if (!source) source = payload.platform.toLowerCase();
  var medium = sanitizeValue(payload.medium, rules) || sanitizeValue(rule.medium, rules) || 'social';

  var vals = {
    utm_source: source,
    utm_medium: medium,
    utm_campaign: sanitizeValue(payload.campaign, rules),
    utm_content: sanitizeValue(payload.content, rules),
    utm_term: sanitizeValue(payload.term, rules),
    utm_id: sanitizeValue(payload.utm_id, rules)
  };

  // valida obrigatórios conforme Config
  var missing = [];
  PARAMS.forEach(function(p) {
    if (rule.obrig[p] && !vals[p]) missing.push(p);
  });
  if (missing.length) {
    throw new Error('Campos obrigatórios em falta: ' + missing.join(', '));
  }

  var pairs = [];
  var order = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'];
  order.forEach(function(k) {
    if (vals[k] !== '') {
      // preserva placeholders de plataforma {token} na URL (a plataforma substitui pelo valor real)
      var encoded = encodeURIComponent(vals[k]).replace(/%7B/g, '{').replace(/%7D/g, '}');
      pairs.push(k + '=' + encoded);
    }
  });
  var separator = base.indexOf('?') === -1 ? '?' : '&';
  var url = base + separator + pairs.join('&');

  try { appendLog(payload, vals, url); } catch (e) { Logger.log('Erro log: ' + e); }
  return { url: url, missing: missing, sanitized: vals };
}

function appendLog(payload, vals, url) {
  ensureSheets();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var log = ss.getSheetByName(LOG);
  var headers = ['Timestamp', 'Plataforma', 'URL base', 'utm_source', 'utm_medium',
    'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'Observações', 'Link UTM completo'];
  log.insertRowBefore(2);
  log.getRange(2, 1, 1, headers.length).setValues([[
    new Date(),
    payload.platform,
    payload.base,
    vals.utm_source,
    vals.utm_medium,
    vals.utm_campaign,
    vals.utm_content,
    vals.utm_term,
    vals.utm_id,
    payload.notes,
    url
  ]]);
}

function addHelpRows(sheet) {
  var SECTION_BG = '#e8f0fe';
  var rows = [
    ['O QUE ISTO FAZ', ''],
    [' ', 'Gerador de links UTM para o time de marketing. Preenche os parâmetros automaticamente por plataforma, monta o link final, e grava cada geração no Log.'],
    [' ', ''],
    ['AS ABAS', ''],
    ['- Instruções (esta aba)', 'Guia. Sempre fica na primeira posição e é recriada se apagada.'],
    ['- Config', 'Configurações gerais + regras por plataforma (source/medium automáticos e quais UTMs são obrigatórias).'],
    ['- Log', 'Histórico automático. Cada link gerado grava uma linha com timestamp no topo.'],
    [' ', ''],
    ['COMO USAR (5 passos)', ''],
    ['1', 'Menu UTM Generator → "Abrir gerador". Barra lateral abre no lado direito.'],
    ['2', 'Escolha a plataforma (Facebook Ads, TikTok Ads, Google Ads ou Influenciadores).'],
    ['3', 'Se for Influenciador, digite o nome do criador SEM @ (ex: fulano → vira utm_source=fulano).'],
    ['4', 'Digite a URL base (ex: nowayco.com.br/pagina) e a campanha. Preencha content/term/id se precisar.'],
    ['5', 'Clique em "Gerar UTM". O link pronto aparece com botão "Copiar". Já salvo no Log automaticamente.'],
    [' ', ''],
    ['CADA CAMPO DA SIDEBAR', ''],
    ['Plataforma', 'Define utm_source/utm_medium automáticos (conforme Config) e quais campos são obrigatórios.'],
    ['URL base', 'Endereço de destino (landing ou ecommerce). https:// é adicionado sozinho se você não digitar.'],
    ['Campanha / Produto → utm_campaign', 'Nome da campanha ou produto. É o parâmetro mais importante para agrupar no Analytics.'],
    ['utm_content', 'Identifica a versão da peça (ex: "banner-v1"). Serve pra testar qual anúncio converte melhor.'],
    ['utm_term', 'Palavra-chave paga (principalmente Google Ads). Ajuda a ver qual termo gerou o clique.'],
    ['utm_id', 'ID da campanha/pixel da própria plataforma. No painel, marque o check "Preenchimento automático de plataforma" para revelar o dropdown de variáveis (ex: {campaign_id} no TikTok, {campaignid} na Google, {ad.id} no Facebook). As variáveis são preservadas e a plataforma troca pelo valor real ao rodar o anúncio.'],
    ['Observações', 'Nota livre do time. NÃO entra na URL final, fica só no Log.'],
    [' ', ''],
    ['COMO A AUTOMAÇÃO CONSIDERA CADA UTM', ''],
    ['utm_source', 'Sempre entra no link. Preenchido automaticamente pela plataforma (Config). No Influenciador, usa o nome digitado. Passa por minúsculas + remoção de símbolos.'],
    ['utm_medium', 'Sempre entra no link. Preenchido automaticamente pela plataforma (Config). Passa por minúsculas + remoção de símbolos.'],
    ['utm_campaign', 'Entra no link se preenchido. Se o Config marcar "obrig?", o link só gera se tiver valor. Passa por minúsculas + remoção de símbolos.'],
    ['utm_content', 'Entra no link se preenchido. Se o Config marcar "obrig?", exige valor. Opcional por padrão (para variações/versões de anúncio).'],
    ['utm_term', 'Entra no link se preenchido. Se o Config marcar "obrig?", exige valor. Opcional por padrão (para palavras-chave/Google Ads).'],
    ['utm_id', 'Entra no link se preenchido. Se o Config marcar "obrig?", exige valor. No check "Preenchimento automático", vale a variável da plataforma (preservada, sem transformação).'],
    ['Campo vazio (opcional)', 'Fica FORA da URL — a automação omite o parâmetro que não foi preenchido.'],
    ['Ordem sempre igual', 'utm_source → utm_medium → utm_campaign → utm_content → utm_term → utm_id.'],
    ['Transformação aplicada', 'Minúsculas e remoção de acentos/símbolos (conforme Config). EXCEÇÃO: as variáveis da plataforma {token} não são transformadas.'],
    ['Caracteres proibidos', '& ? # % = < > @ são removidos. Espaços, acentos e demais símbolos viram "_".'],
    [' ', ''],
    ['O QUE FAZ AUTOMATICAMENTE', ''],
    ['- https://', 'Adicionado sozinho se a URL base não tiver protocolo.'],
    ['- utm_source/utm_medium', 'Preenchidos pela plataforma escolhida, conforme a aba Config.'],
    ['- Minúsculas / remoção de símbolos', 'Se ligado no Config, os valores são convertidos pra minúsculas e acentos/símbolos viram "_".'],
    ['- Campos vazios', 'São omitidos do link, a menos que o Config os marque como obrigatórios.'],
    ['- Campos obrigatórios', 'Definidos no Config por plataforma. Se faltar, o link não gera e avisa.'],
    ['- Caracteres que quebram URL', 'Caracteres & ? # % = < > @ são bloqueados no painel e removidos ao gerar. Espaços/acentos/símbolos viram "_".'],
    ['- Confirmação manual antes de veicular', 'Ao gerar, um aviso pede pra você CONFIRMAR MANUALMENTE o link UTM antes de publicar o anúncio.'],
    ['- Log com timestamp', 'Cada geração grava linha nova no topo do Log com data/hora. Sem botão de salvar.'],
    [' ', ''],
    ['COMO PERSONALIZAR', ''],
    ['- Utms em minúsculo / tirar símbolos', 'No topo do Config, colunas B2 e B3 (SIM/NAO).'],
    ['- Obrigatório vs opcional', 'Na tabela do Config, escolha SIM ou NAO nas colunas "obrig?" por plataforma.'],
    ['- Mudar source/medium', 'Edite o valor ao lado da plataforma na Config.'],
    ['- Adicionar plataforma', 'Na aba Config, escreva uma nova linha na tabela (nome da plataforma + source/medium + o que é obrigatório). Ela aparece no dropdown da sidebar. Dica: para usar um campo de "nome do influenciador" numa nova plataforma, coloque o valor "[nome]" na coluna utm_source.'],
    ['- utm_id automático', 'Marque o check "Preenchimento automático de plataforma" no utm_id e escolha a variável no dropdown. Só aparece para Facebook/Google/TikTok, não para Influenciadores.'],
    [' ', ''],
    ['DÚVIDAS FREQUENTES', ''],
    ['- Vai apagar meus dados no Log?', 'Não. O Log só adiciona linhas novas no topo.'],
    ['- E se eu apagar a aba Instruções?', 'Ela é recriada automaticamente na primeira posição na próxima abertura.'],
    ['- E se a URL for de landing e ecommerce?', 'Cada uso pede a URL base da página, então serve pra qualquer destino.'],
  ];
  var start = 3;
  rows.forEach(function(r, i) {
    sheet.getRange(start + i, 1).setValue(r[0]);
    if (r[1]) {
      sheet.getRange(start + i, 2).setValue(r[1]);
      sheet.getRange(start + i, 1).setFontWeight('bold');
    }
    // destaca títulos de seção: sem descrição, não é linha em branco, não é nuance "dica"
    if (!r[1] && r[0].trim() !== '' && r[0].charAt(0) !== '-') {
      sheet.getRange(start + i, 1, 1, 2).setBackground(SECTION_BG);
    }
  });
  sheet.getRange(start, 1, rows.length, 1).setFontStyle('bold');
}
