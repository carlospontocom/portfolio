import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../Config/Firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import ChatUsuario from './ChatUsuario';

import {
    collection,
    onSnapshot,
    addDoc,
    serverTimestamp
} from "firebase/firestore";

import PerguntaResultado from './PerguntaResultado';
import Header from '../../Header';

const normalizarTexto = (texto) => {
    if (!texto) return "";
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, '');
};

const DashboardUsuario = () => {
    const navigate = useNavigate();
    const [carregando, setCarregando] = useState(true);
    const [usuario, setUsuario] = useState(null);
    const [termoBusca, setTermoBusca] = useState("");
    const [resultados, setResultados] = useState([]);
    const [mostrarFormularioIA, setMostrarFormularioIA] = useState(false);
    const [enviando, setEnviando] = useState(false);

    // --- Autenticação ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUsuario(user);
            } else {
                navigate('/');
            }
            setCarregando(false);
        });
        return () => unsubscribe();
    }, [navigate]);

    // --- Função de Logout ---
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            alert("Erro ao sair. Tente novamente.");
        }
    };

    // --- Lógica de Busca em Tempo Real ---
    useEffect(() => {
        if (termoBusca.trim().length < 2) {
            setResultados([]);
            setMostrarFormularioIA(false);
            return;
        }

        const refBase = collection(db, "base_conhecimento");
        const unsubscribe = onSnapshot(refBase, (snapshot) => {
            const dados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const termoNormalizado = normalizarTexto(termoBusca);

            const encontrados = dados.filter(item =>
                normalizarTexto(item.pergunta).includes(termoNormalizado) ||
                normalizarTexto(item.resposta || "").includes(termoNormalizado)
            );

            setResultados(encontrados);
            setMostrarFormularioIA(encontrados.length === 0);
        });

        return () => unsubscribe();
    }, [termoBusca]);

    // --- Enviar pergunta não encontrada para análise ---
    const enviarParaIA = async () => {
        if (termoBusca.trim().length < 5) {
            return alert("Por favor, detalhe um pouco mais sua dúvida.");
        }

        setEnviando(true);
        try {
            await addDoc(collection(db, "perguntas_pendentes"), {
                usuarioId: usuario?.uid,
                usuarioEmail: usuario?.email,
                pergunta: termoBusca.trim(),
                status: "pendente",
                criadoEm: serverTimestamp()
            });
            alert("🚀 Pergunta enviada para análise!");
            setTermoBusca("");
        } catch (e) {
            console.error(e);
            alert("Erro ao enviar pergunta.");
        } finally {
            setEnviando(false);
        }
    };

    if (carregando) {
        return (
            <div className="h-screen flex items-center justify-center font-sans text-slate-500">
                Carregando...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 relative selection:bg-blue-100">
            <Header isAdmin={false} />

            {/* Botão Sair - Canto superior direito */}
            <button
                onClick={handleLogout}
                className="fixed top-14 right-6 z-50 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
            </button>

            {/* Cabeçalho de Busca (Hero) */}
            <header className="pt-24 pb-12 px-4 text-center">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-8">
                    <span className="animate-pulse">🛡️</span> Central de Conhecimento Inteligente
                </div>

                <h1 className="text font-extrabold text-[#1a2b4b] mb-12 tracking-tight">
                    Qual é a sua dúvida?
                </h1>

                <div className="max-w-3xl mx-auto relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <svg className="w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Digite sua dúvida ou procure um tema..."
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                        className="w-full pl-16 pr-44 py-7 bg-gray-50 border-none rounded-[2rem] text-xl focus:ring-4 focus:ring-blue-100 transition-all shadow-sm placeholder:text-gray-400"
                    />
                    <button
                        onClick={enviarParaIA}
                        className="absolute right-3 top-3 bottom-3 bg-[#0047AB] text-white px-10 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-800 transition-all shadow-lg active:scale-95"
                    >
                        Buscar <span className="text-xl">→</span>
                    </button>
                </div>
            </header>

            {/* Área de Resultados Dinâmica */}
            {termoBusca.trim().length >= 2 && (
                <main className="max-w-4xl mx-auto px-4 pb-32 animate-in fade-in slide-in-from-top-4 duration-500">


                    <PerguntaResultado
                        termoBusca={termoBusca}
                        resultados={resultados}
                        mostrarFormularioIA={mostrarFormularioIA}
                        enviando={enviando}
                        enviarParaIA={enviarParaIA}
                    />
                </main>
            )}



            <ChatUsuario />
        </div>
    );
};

export default DashboardUsuario;