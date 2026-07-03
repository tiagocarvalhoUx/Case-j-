"use client";

import { useEffect } from "react";

/**
 * Registra o service worker (somente em produção). Habilita instalação como
 * PWA e cache offline básico. Em desenvolvimento, garante que nenhum SW
 * antigo fique ativo (evita servir assets em cache durante o dev).
 */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV === "production") {
      const onLoad = () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {
          /* falha silenciosa: o app continua funcionando sem SW */
        });
      };
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    } else {
      navigator.serviceWorker
        .getRegistrations()
        .then((rs) => rs.forEach((r) => r.unregister()))
        .catch(() => {});
    }
  }, []);

  return null;
}
