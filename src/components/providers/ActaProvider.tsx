"use client";

import { ActaConfig, testNet } from "@acta-team/acta-sdk";
import { ReactNode } from "react";

interface ActaProviderProps {
  children: ReactNode;
}

/**
 * Provedor do SDK do ACTA para envolver a aplicação.
 * Configurado por padrão para a testNet do Stellar.
 */
export function ActaProvider({ children }: ActaProviderProps) {
  return <ActaConfig baseURL={testNet}>{children}</ActaConfig>;
}
