/**
 * Client-side runtime error logger for seaLens C2.
 */
export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  console.error("[seaLens Error]", error, context);
}
