/**
 * Muhit (environment) sozlamalari uchun yordamchi funksiyalar.
 * Production da xavfsizlik uchun muhim qiymatlar majburiy qilinadi.
 */

const DEV_JWT_SECRET = 'tolqin-math-dev-secret-change-me';
const MIN_SECRET_LENGTH = 32;

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * JWT kalitini qaytaradi.
 * Production da JWT_SECRET majburiy va kamida 32 belgidan iborat bo'lishi kerak —
 * aks holda ilova ishga tushmaydi (token qalbakilashtirilishining oldini oladi).
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();

  if (isProduction()) {
    if (!secret || secret.length < MIN_SECRET_LENGTH) {
      throw new Error(
        `JWT_SECRET majburiy: production da kamida ${MIN_SECRET_LENGTH} belgili maxfiy kalit kerak. ` +
          'Yangi kalit: openssl rand -hex 32',
      );
    }
    if (secret === DEV_JWT_SECRET || secret === 'tolqin-math-secret-key-2026') {
      throw new Error(
        'JWT_SECRET default qiymatda qolgan — production da uni almashtirish shart.',
      );
    }
    return secret;
  }

  return secret || DEV_JWT_SECRET;
}

/**
 * CORS uchun ruxsat etilgan domenlar ro'yxati (vergul bilan ajratilgan).
 * Bo'sh bo'lsa: dev da hamma origin, production da faqat same-origin.
 */
export function getCorsOrigins(): string[] {
  return (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}
