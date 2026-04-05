import React, { useState } from 'react';

const PerguntaResultado = ({
    termoBusca,
    setTermoBusca,
    resultados,
    mostrarFormularioIA,
    enviando,
    enviarParaIA
}) => {
    const [mostrarToast, setMostrarToast] = useState(false);

    const handleCopiar = (texto) => {
        navigator.clipboard.writeText(texto)
            .then(() => {
                setMostrarToast(true);
                setTimeout(() => setMostrarToast(false), 2000);
            })
            .catch((err) => {
                console.error("Erro ao copiar: ", err);
            });
    };

    return (
        <div className="relative">
            {/* TOAST NOTIFICATION */}
            {mostrarToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700">
                        <span className="text-green-400">✔</span>
                        <span className="text-sm font-bold">Resposta copiada!</span>
                    </div>
                </div>
            )}

            {/* Resultados */}
            <div className="mt-8 space-y-4">
                {resultados.map((res) => (
                    <div key={res.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{res.pergunta}</h3>

                        <div className="relative group">
                            <div className="bg-slate-50 rounded-xl p-4 text-slate-600 italic pr-12">
                                {res.resposta}
                            </div>

                            <button
                                onClick={() => handleCopiar(res.resposta)}
                                className="absolute top-2 right-2 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Copiar resposta"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                            </button>
                        </div>

                        {res.usuarioEmail && (
                            <p className="text-xs text-slate-400 mt-2">
                                Pergunta feita por: {res.usuarioEmail}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Formulário IA */}
            {mostrarFormularioIA && termoBusca && (
                <div className="mt-8 bg-indigo-600 rounded-[2rem] p-8 text-white">
                    <h3 className="text-xl font-bold mb-2">Não achou o que procurava?</h3>
                    <p className="mb-6 opacity-90">Enviar a pergunta "{termoBusca}" para nossa equipe?</p>
                    <button
                        onClick={enviarParaIA}
                        disabled={enviando}
                        className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 disabled:opacity-50"
                    >
                        {enviando ? "Enviando..." : "Sim, enviar pergunta"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default PerguntaResultado;