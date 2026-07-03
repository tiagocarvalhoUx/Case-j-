import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Fixa a raiz do workspace neste projeto (evita inferência incorreta
  // quando existem lockfiles em diretórios acima).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
