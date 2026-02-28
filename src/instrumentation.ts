import * as Sentry from "@sentry/nextjs";

export async function register() {
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    integrations: [
      // 将 console.log / warn / error 作为日志发送到 Sentry
      Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
    ],

    // 采样率：1 = 100% 的请求都追踪（生产环境建议调低，如 0.1）
    tracesSampleRate: 1,

    // 启用日志上报
    enableLogs: true,

    // 上报用户 IP 等 PII 信息（按需开启）
    sendDefaultPii: true,
  });
}

// 自动捕获所有请求级别的错误
export const onRequestError = Sentry.captureRequestError;
