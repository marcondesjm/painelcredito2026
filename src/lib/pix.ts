/**
 * Gerador de Payload PIX seguindo o padrão EMV/BRCode
 * Especificação: https://www.bcb.gov.br/content/estabilidadefinanceira/forumpiram/BR%20Code.pdf
 */

// Função para calcular CRC16-CCITT (polinômio 0x1021)
function crc16ccitt(str: string): string {
  let crc = 0xFFFF;
  
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
    crc &= 0xFFFF;
  }
  
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Formata um campo TLV (Tag-Length-Value)
function formatTLV(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

// Remove caracteres especiais e acentos
function sanitizeString(str: string, maxLength: number = 25): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .substring(0, maxLength)
    .trim();
}

// Detecta o tipo de chave PIX
function getPixKeyType(key: string): 'CPF' | 'CNPJ' | 'PHONE' | 'EMAIL' | 'EVP' {
  const cleanKey = key.replace(/\D/g, '');
  
  if (/^\d{11}$/.test(cleanKey)) {
    // Pode ser CPF ou telefone
    if (key.includes('+') || key.startsWith('55')) {
      return 'PHONE';
    }
    return 'CPF';
  }
  
  if (/^\d{14}$/.test(cleanKey)) {
    return 'CNPJ';
  }
  
  if (key.includes('@')) {
    return 'EMAIL';
  }
  
  // Chave aleatória (EVP)
  return 'EVP';
}

// Formata a chave PIX conforme o tipo
function formatPixKey(key: string): string {
  const type = getPixKeyType(key);
  
  switch (type) {
    case 'PHONE':
      // Telefone deve estar no formato +5511999999999
      const cleanPhone = key.replace(/\D/g, '');
      return cleanPhone.startsWith('55') ? `+${cleanPhone}` : `+55${cleanPhone}`;
    case 'CPF':
    case 'CNPJ':
      return key.replace(/\D/g, '');
    case 'EMAIL':
      return key.toLowerCase();
    default:
      return key;
  }
}

export interface PixPayloadOptions {
  /** Chave PIX (CPF, CNPJ, Email, Telefone ou Chave Aleatória) */
  pixKey: string;
  /** Nome do beneficiário (max 25 caracteres) */
  merchantName: string;
  /** Cidade do beneficiário (max 15 caracteres) */
  merchantCity?: string;
  /** Valor da transação (opcional para QR estático) */
  amount?: number;
  /** Identificador da transação / descrição (max 25 caracteres) */
  txId?: string;
  /** Descrição adicional */
  description?: string;
}

/**
 * Gera o payload do PIX no formato EMV/BRCode
 */
export function generatePixPayload(options: PixPayloadOptions): string {
  const {
    pixKey,
    merchantName,
    merchantCity = 'SAO PAULO',
    amount,
    txId,
    description
  } = options;

  const formattedKey = formatPixKey(pixKey);
  const sanitizedName = sanitizeString(merchantName, 25);
  const sanitizedCity = sanitizeString(merchantCity, 15);
  
  // Payload Format Indicator
  let payload = formatTLV('00', '01');
  
  // Point of Initiation Method (12 = valor pode mudar, 11 = valor fixo)
  payload += formatTLV('01', amount ? '12' : '11');
  
  // Merchant Account Information (ID 26)
  // Estrutura: GUI (ID 00) + Chave PIX (ID 01) + Descrição (ID 02, opcional)
  let merchantAccount = formatTLV('00', 'br.gov.bcb.pix');
  merchantAccount += formatTLV('01', formattedKey);
  
  if (description) {
    merchantAccount += formatTLV('02', sanitizeString(description, 25));
  }
  
  payload += formatTLV('26', merchantAccount);
  
  // Merchant Category Code (MCC)
  payload += formatTLV('52', '0000');
  
  // Transaction Currency (986 = BRL)
  payload += formatTLV('53', '986');
  
  // Transaction Amount (opcional)
  if (amount && amount > 0) {
    payload += formatTLV('54', amount.toFixed(2));
  }
  
  // Country Code
  payload += formatTLV('58', 'BR');
  
  // Merchant Name
  payload += formatTLV('59', sanitizedName);
  
  // Merchant City
  payload += formatTLV('60', sanitizedCity);
  
  // Additional Data Field Template (ID 62)
  if (txId) {
    const additionalData = formatTLV('05', sanitizeString(txId, 25));
    payload += formatTLV('62', additionalData);
  }
  
  // CRC16 (ID 63) - placeholder para calcular
  payload += '6304';
  
  // Calcula e adiciona o CRC16
  const crc = crc16ccitt(payload);
  payload = payload.slice(0, -4) + formatTLV('63', crc);
  
  return payload;
}

/**
 * Gera a URL do QR Code a partir do payload PIX
 */
export function generatePixQRCodeUrl(payload: string, size: number = 200): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(payload)}&ecc=M`;
}

/**
 * Função helper que gera payload e URL do QR Code
 */
export function generatePixQRCode(options: PixPayloadOptions, size: number = 200): {
  payload: string;
  qrCodeUrl: string;
} {
  const payload = generatePixPayload(options);
  const qrCodeUrl = generatePixQRCodeUrl(payload, size);
  
  return { payload, qrCodeUrl };
}
