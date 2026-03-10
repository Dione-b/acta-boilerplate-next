"use client";

import { useState } from "react";
import { useVault, useCredential, useVaultRead } from "@acta-team/acta-sdk";

export default function Home() {
  const { createVault } = useVault();
  const { issue } = useCredential();
  const { verifyVc } = useVaultRead();

  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>(["[System] ACTA SDK Initialized."]);

  // Função auxiliar para logs
  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // 1. Criar Vault (Exemplo)
  const handleCreateVault = async () => {
    try {
      setLoading(true);
      addLog("Iniciando criação de Vault...");

      // TODO: Substituir por assinatura real (ex: xBull / Freighter)
      const mockSigner = async (xdr: string, opts: { networkPassphrase: string }) => {
        addLog(`Assinando XDR no network: ${opts.networkPassphrase.substring(0, 15)}...`);
        return xdr; // Mocking signature
      };

      const { txId } = await createVault({
        owner: "GDU5O6WUZGZZZCQXZ4OQRXYL73Z2YIYWYVNYTY676YQQZ76YZVZZZZZZ", // Exemplo
        didUri: "did:pkh:stellar:testnet:GDU5...",
        signTransaction: mockSigner,
      });

      addLog(`Vault criado com sucesso! TX: ${txId}`);
    } catch (error: any) {
      addLog(`❌ Erro no Vault: ${error.message || "Falha desconhecida"}`);
    } finally {
      setLoading(false);
    }
  };

  // 2. Emitir Credencial (Exemplo)
  const handleIssueCredential = async () => {
    try {
      setLoading(true);
      addLog("Iniciando emissão de credencial...");

      // TODO: Substituir por assinatura real
      const mockSigner = async (xdr: string, opts: { networkPassphrase: string }) => {
        addLog(`Assinando XDR para emissão...`);
        return xdr;
      };

      const vcData = {
        "@context": [
          "https://www.w3.org/ns/credentials/v2",
          "https://www.w3.org/ns/credentials/examples/v2",
        ],
        type: ["VerifiableCredential", "UniversityDegreeCredential"],
        credentialSubject: {
          id: "did:pkh:stellar:testnet:GBH7...",
          name: "João da Silva",
          degree: "Bachelor of Computer Science",
        },
      };

      const { txId } = await issue({
        owner: "GDU5O6WUZGZZZCQXZ4OQRXYL73Z2YIYWYVNYTY676YQQZ76YZVZZZZZZ", // Owner do vault
        vcId: `degree-cs-${Date.now()}`,
        vcData: JSON.stringify(vcData),
        issuer: "GDU5O6WUZGZZZCQXZ4OQRXYL73Z2YIYWYVNYTY676YQQZ76YZVZZZZZZ",
        holder: "GBH7ZYIYWYVNYTY6O6WUZGZZZCQXZ4OQRXYL73Z276YQQZ76YZVZZZZZ",
        signTransaction: mockSigner,
      });

      addLog(`✅ Credencial emitida! TX: ${txId}`);
    } catch (error: any) {
      addLog(`❌ Erro na Emissão: ${error.message || "Falha desconhecida"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 md:p-24 max-w-5xl mx-auto space-y-12">
      <header className="space-y-4">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span>SDK Conectado: Testnet</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          ACTA SDK <span className="text-indigo-600">Boilerplate</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Interface de teste para as operações principais do Smart Contract vc-vault usando hooks e contexto global do @acta-team/acta-sdk.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Actions Panel */}
        <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">1. Vault Operations</h2>
              <p className="text-sm text-gray-500 mb-4">Crie ou gerencie um vault de identidade auto-soberana.</p>
              <button
                onClick={handleCreateVault}
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? "Processando..." : "Criar Vault de Teste"}
              </button>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">2. Issuance</h2>
              <p className="text-sm text-gray-500 mb-4">Emita uma credencial verificável (VC) salvando seu estado on-chain.</p>
              <button
                onClick={handleIssueCredential}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? "Processando..." : "Emitir Diploma Universitário"}
              </button>
            </div>
            
            <div className="h-px bg-gray-100 w-full" />

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">3. Verification</h2>
              <p className="text-sm text-gray-500 mb-4">Hook utilitário useVaultRead() exporta funções de leitura.</p>
              <button
                onClick={() => addLog("A verificação depende de um VC_ID emitido. Implemente o fetch usando verifyVc() na sua UX!")}
                disabled={loading}
                className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50"
              >
                Verificar Status da VC
              </button>
            </div>
          </div>
        </section>

        {/* Terminal/Log Panel */}
        <section className="bg-gray-900 rounded-2xl p-6 shadow-xl flex flex-col font-mono text-sm">
          <div className="flex items-center space-x-2 mb-6">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-4 text-gray-400 text-xs uppercase tracking-wider font-semibold">
              Transaction Logs
            </span>
          </div>
          
          <div className="flex-1 rounded-lg bg-gray-950 p-4 overflow-y-auto min-h-[400px] border border-gray-800 space-y-2">
            {logs.length === 0 ? (
              <p className="text-gray-600 italic">Nenhum evento registrado.</p>
            ) : (
              logs.map((log, index) => (
                <div 
                  key={index} 
                  className={`break-words ${
                    log.includes('❌') ? 'text-red-400' : 
                    log.includes('✅') ? 'text-green-400' : 
                    'text-gray-300'
                  }`}
                >
                  {log}
                </div>
              ))
            )}
          </div>
          <button 
            onClick={() => setLogs([])}
            className="mt-4 text-xs text-gray-500 hover:text-gray-300 self-end transition-colors"
          >
            Limpar Logs
          </button>
        </section>
      </div>
    </main>
  );
}
