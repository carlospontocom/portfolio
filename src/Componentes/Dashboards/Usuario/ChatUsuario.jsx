import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../Config/Firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import "./ChatUsuario.css";

const ChatUsuario = () => {
    const [aberto, setAberto] = useState(false);
    const [mensagens, setMensagens] = useState([]);
    const [novaMsg, setNovaMsg] = useState("");
    const [naoLidas, setNaoLidas] = useState(0);
    const scrollRef = useRef(null);
    const usuario = auth.currentUser;

    const formatarData = (timestamp) => {
        if (!timestamp) return "";

        const dataMsg = timestamp.toDate();
        const hoje = new Date();

        const hora = dataMsg.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const diaMes = dataMsg.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

        const ehHoje = dataMsg.getDate() === hoje.getDate() &&
            dataMsg.getMonth() === hoje.getMonth() &&
            dataMsg.getFullYear() === hoje.getFullYear();

        // Se quiser que a data APAREÇA SEMPRE (mesmo hoje), use o retorno abaixo:
        if (ehHoje) {
            return `Hoje às ${hora}`;
        } else {
            return `${diaMes} às ${hora}`;
        }
    };

    useEffect(() => {
        if (aberto) {
            setNaoLidas(0);
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [aberto, mensagens]);

    useEffect(() => {
        if (!usuario) return;

        // AJUSTE AQUI: Mudei "enviadoEm" para "criadoEm" para bater com sua imagem
        const q = query(
            collection(db, "chats", usuario.uid, "mensagens"),
            orderBy("criadoEm", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const m_dados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (!aberto && m_dados.length > mensagens.length) {
                const ultimaMsg = m_dados[m_dados.length - 1];
                if (ultimaMsg.tipo === 'admin') setNaoLidas(prev => prev + 1);
            }
            setMensagens(m_dados);
        });
        return () => unsubscribe();
    }, [usuario, aberto, mensagens.length]);

    const enviar = async (e) => {
        e.preventDefault();
        if (!novaMsg.trim()) return;
        try {
            await addDoc(collection(db, "chats", usuario.uid, "mensagens"), {
                texto: novaMsg.trim(),
                criadoEm: serverTimestamp(), // AJUSTE AQUI: salvando como criadoEm
                remetenteId: usuario.uid,
                tipo: "cliente"
            });
            setNovaMsg("");
        } catch (error) {
            console.error("Erro ao enviar:", error);
        }
    };

    if (!usuario) return null;

    return (
        <div className="chat-wrapper-unico">
            <button className="botao-flutuante-abrir" onClick={() => setAberto(!aberto)}>
                {aberto ? "✕" : "💬"}
                {!aberto && naoLidas > 0 && <span className="badge-notificacao">{naoLidas}</span>}
            </button>

            {aberto && (
                <div className="caixa-chat">
                    <div className="topo-chat">Suporte</div>

                    <div className="corpo-mensagens">
                        {mensagens.map(m => (
                            <div key={m.id} className={`msg-container ${m.tipo === 'cliente' ? 'dir' : 'esq'}`}>
                                <div className="balao-texto">
                                    {m.texto}
                                </div>
                                <span className="msg-hora-fora">
                                    {/* AJUSTE AQUI: passando criadoEm para a função */}
                                    {formatarData(m.criadoEm)}
                                </span>
                            </div>
                        ))}
                        <div ref={scrollRef} />
                    </div>

                    <form onSubmit={enviar} className="rodape-input">
                        <input
                            className="campo-texto"
                            value={novaMsg}
                            onChange={e => setNovaMsg(e.target.value)}
                            placeholder="Digite sua mensagem..."
                        />
                        <button type="submit" className="seta-enviar">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatUsuario;