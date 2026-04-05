import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../Config/Firebase';
import { collection, query, onSnapshot, orderBy, addDoc, serverTimestamp, collectionGroup, where } from "firebase/firestore";
import "./ChatAdmin.css";

const ChatAdmin = () => {
    const [isAberto, setIsAberto] = useState(false);
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
    const [mensagens, setMensagens] = useState([]);
    const [input, setInput] = useState("");
    const [busca, setBusca] = useState("");
    const [notificacoes, setNotificacoes] = useState([]);
    const scrollRef = useRef(null);

    // FUNÇÃO CORRIGIDA (Igual à do ChatUsuario que funcionou)
    const formatarData = (timestamp) => {
        if (!timestamp) return "";

        const dataMsg = timestamp.toDate();
        const hoje = new Date();

        const hora = dataMsg.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const diaMes = dataMsg.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

        const ehHoje = dataMsg.getDate() === hoje.getDate() &&
            dataMsg.getMonth() === hoje.getMonth() &&
            dataMsg.getFullYear() === hoje.getFullYear();

        if (ehHoje) {
            return `Hoje às ${hora}`;
        } else {
            return `${diaMes} às ${hora}`;
        }
    };

    // 1. Monitorar Usuários e Notificações
    useEffect(() => {
        const unsubscribeUsers = onSnapshot(collection(db, "usuarios"), (snapshot) => {
            setListaUsuarios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const qNotificacoes = query(
            collectionGroup(db, "mensagens"),
            where("tipo", "==", "cliente")
        );

        const unsubscribeNotify = onSnapshot(qNotificacoes, (snapshot) => {
            const idsComMensagem = new Set();
            snapshot.docs.forEach(doc => {
                const userId = doc.ref.path.split('/')[1];
                idsComMensagem.add(userId);
            });
            setNotificacoes(Array.from(idsComMensagem));
        });

        return () => { unsubscribeUsers(); unsubscribeNotify(); };
    }, []);

    // 2. Monitorar Mensagens do Usuário Selecionado
    useEffect(() => {
        if (!usuarioSelecionado) return;

        setNotificacoes(prev => prev.filter(id => id !== usuarioSelecionado.id));

        // Mantendo "criadoEm" conforme seu banco
        const q = query(
            collection(db, "chats", usuarioSelecionado.id, "mensagens"),
            orderBy("criadoEm", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMensagens(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        });

        return () => unsubscribe();
    }, [usuarioSelecionado]);

    const enviarMsg = async (e) => {
        e.preventDefault();
        if (!input.trim() || !usuarioSelecionado) return;

        try {
            await addDoc(collection(db, "chats", usuarioSelecionado.id, "mensagens"), {
                texto: input,
                tipo: "admin",
                criadoEm: serverTimestamp()
            });
            setInput("");
        } catch (error) {
            console.error("Erro ao enviar mensagem do admin:", error);
        }
    };

    return (
        <div className="chat-admin-floating">
            <button className="chat-trigger-button" onClick={() => setIsAberto(!isAberto)}>
                {isAberto ? "✕" : "💬"}
                {!isAberto && notificacoes.length > 0 && (
                    <span className="notif-badge-main">{notificacoes.length}</span>
                )}
            </button>

            {isAberto && (
                <div className="chat-window-container">
                    {!usuarioSelecionado ? (
                        <>
                            <div className="chat-header">
                                <span className="chat-header-title">Suporte Admin</span>
                            </div>
                            <div style={{ padding: '10px' }}>
                                <input
                                    className="chat-input"
                                    style={{ width: '100%' }}
                                    placeholder="Buscar usuário..."
                                    value={busca}
                                    onChange={e => setBusca(e.target.value)}
                                />
                            </div>
                            <div className="users-list">
                                {listaUsuarios
                                    .filter(u => u.email?.toLowerCase().includes(busca.toLowerCase()))
                                    .map(user => (
                                        <button key={user.id} className="user-item" onClick={() => setUsuarioSelecionado(user)}>
                                            <div className="user-avatar">
                                                {user.email?.charAt(0).toUpperCase()}
                                                {notificacoes.includes(user.id) && <div className="notif-badge" />}
                                            </div>
                                            <div style={{ textAlign: 'left', flex: 1 }}>
                                                <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{user.nome || 'Usuário'}</div>
                                                <div style={{ fontSize: '11px', color: '#888' }}>{user.email}</div>
                                            </div>
                                        </button>
                                    ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="chat-header">
                                <button onClick={() => setUsuarioSelecionado(null)} className="back-button">←</button>
                                <span className="chat-header-title">{usuarioSelecionado.nome || usuarioSelecionado.email}</span>
                            </div>
                            <div className="messages-area">
                                {mensagens.map(m => (
                                    <div key={m.id} className={`msg-container-admin ${m.tipo === 'admin' ? 'admin' : 'user'}`}>
                                        <div className="msg-bubble">
                                            {m.texto}
                                        </div>
                                        {/* AQUI ESTAVA O ERRO: Use m.criadoEm e a nova função */}
                                        <span className="msg-time-admin">
                                            {formatarData(m.criadoEm)}
                                        </span>
                                    </div>
                                ))}
                                <div ref={scrollRef} />
                            </div>
                            <form onSubmit={enviarMsg} className="chat-footer">
                                <input
                                    className="chat-input"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Responder..."
                                />
                                <button type="submit" className="send-button-admin">➤</button>
                            </form>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatAdmin;