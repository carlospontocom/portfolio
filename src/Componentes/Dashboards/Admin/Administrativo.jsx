import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../Config/Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
    collection,
    onSnapshot,
    query,
    where,
    addDoc,
    updateDoc,
    doc,
    deleteDoc, // Adicionado
    serverTimestamp
} from "firebase/firestore";
import "./Administrativo.css";

import ChatAdmin from "./ChatAdmin";

function DashboardAdmin() {
    const navigate = useNavigate();
    const [base, setBase] = useState([]);
    const [pendentes, setPendentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("pendentes");
    const [modalAberto, setModalAberto] = useState(false);
    const [perguntaSelecionada, setPerguntaSelecionada] = useState(null);
    const [resposta, setResposta] = useState("");
    const [busca, setBusca] = useState("");

    // Estados de Paginação
    const [paginaPendentes, setPaginaPendentes] = useState(1);
    const [paginaBase, setPaginaBase] = useState(1);
    const itensPorPagina = 6;

    useEffect(() => {
        const cancelarInscricao = onAuthStateChanged(auth, (usuario) => {
            if (!usuario) navigate("/login");
        });
        return () => cancelarInscricao();
    }, [navigate]);

    useEffect(() => {
        const unsubBase = onSnapshot(collection(db, "base_conhecimento"), (snapshot) => {
            setBase(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        const q = query(collection(db, "perguntas_pendentes"), where("status", "==", "pendente"));
        const unsubPendentes = onSnapshot(q, (snapshot) => {
            setPendentes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubBase();
            unsubPendentes();
        };
    }, []);

    const logout = () => signOut(auth);

    // FUNÇÕES DE MANIPULAÇÃO
    const abrirModal = (p) => {
        setPerguntaSelecionada(p);
        setResposta(p.resposta || ""); // Se for edição, carrega a resposta atual
        setModalAberto(true);
    };

    const excluirDaBase = async (id) => {
        if (window.confirm("Deseja realmente excluir este item da base?")) {
            try {
                await deleteDoc(doc(db, "base_conhecimento", id));
                alert("Item removido com sucesso!");
            } catch (error) {
                console.error(error);
                alert("Erro ao excluir.");
            }
        }
    };

    const copiarResposta = (texto) => {
        navigator.clipboard.writeText(texto);
        alert("Resposta copiada para a área de transferência!");
    };

    const salvarResposta = async () => {
        if (!resposta.trim()) return alert("Digite uma resposta.");
        try {
            // Verifica se é uma edição (já existe na base) ou uma nova resposta (pendente)
            if (perguntaSelecionada.status === undefined) {
                // Edição de item existente na base
                await updateDoc(doc(db, "base_conhecimento", perguntaSelecionada.id), {
                    resposta: resposta.trim(),
                    editadoEm: serverTimestamp(),
                    editadoPor: auth.currentUser?.email
                });
            } else {
                // Nova resposta vinda de pendentes
                await addDoc(collection(db, "base_conhecimento"), {
                    criadoEm: serverTimestamp(),
                    pergunta: perguntaSelecionada.pergunta,
                    perguntaFormatada: perguntaSelecionada.pergunta.toLowerCase(),
                    resposta: resposta.trim(),
                    usuarioEmail: perguntaSelecionada.usuarioEmail,
                    usuarioId: perguntaSelecionada.usuarioId,
                    respondidoPor: auth.currentUser?.email
                });

                await updateDoc(doc(db, "perguntas_pendentes", perguntaSelecionada.id), {
                    status: "respondida"
                });
            }

            setModalAberto(false);
            alert("Operação realizada com sucesso!");
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar.");
        }
    };

    const baseFiltrada = base.filter(
        (item) =>
            item.pergunta?.toLowerCase().includes(busca.toLowerCase()) ||
            item.resposta?.toLowerCase().includes(busca.toLowerCase())
    );

    const paginar = (lista, paginaAtual) => {
        const inicio = (paginaAtual - 1) * itensPorPagina;
        return lista.slice(inicio, inicio + itensPorPagina);
    };

    const totalPaginasPendentes = Math.ceil(pendentes.length / itensPorPagina);
    const totalPaginasBase = Math.ceil(baseFiltrada.length / itensPorPagina);

    if (loading) return <div className="loading">Carregando painel...</div>;

    return (
        <section className="dashboard">
            <div className="flex__my">
                <h2 className="title">Painel Administrativo</h2>
                <button onClick={logout} className="btn__sair">Sair</button>
            </div>

            <div className="filtros">
                <button
                    className={filtro === "pendentes" ? "filtro ativo" : "filtro"}
                    onClick={() => { setFiltro("pendentes"); setPaginaPendentes(1); }}
                >
                    📌 Pendentes ({pendentes.length})
                </button>
                <button
                    className={filtro === "base" ? "filtro ativo" : "filtro"}
                    onClick={() => { setFiltro("base"); setPaginaBase(1); }}
                >
                    📚 Base de Conhecimento
                </button>
                {filtro === "base" && (
                    <input
                        type="text"
                        placeholder="Pesquisar na base..."
                        value={busca}
                        onChange={(e) => { setBusca(e.target.value); setPaginaBase(1); }}
                        className="input__busca"
                    />
                )}
            </div>

            {filtro === "pendentes" && (
                <>
                    <div className="lista">
                        {pendentes.length === 0 ? (
                            <p className="empty">Nenhuma pergunta pendente.</p>
                        ) : (
                            paginar(pendentes, paginaPendentes).map((p) => (
                                <div key={p.id} className="card__faq card__pendente">
                                    <p><strong>Pergunta:</strong> {p.pergunta}</p>
                                    <p><strong>Usuário:</strong> {p.usuarioEmail}</p>
                                    <button onClick={() => abrirModal(p)} className="btn__responder">
                                        Responder
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    {/* ... Paginação Pendentes ... */}
                    {totalPaginasPendentes > 1 && (
                        <div className="paginacao">
                            <button disabled={paginaPendentes === 1} onClick={() => setPaginaPendentes(p => p - 1)}> Anterior </button>
                            <span>Página {paginaPendentes} de {totalPaginasPendentes}</span>
                            <button disabled={paginaPendentes === totalPaginasPendentes} onClick={() => setPaginaPendentes(p => p + 1)}> Próxima </button>
                        </div>
                    )}
                </>
            )}

            {filtro === "base" && (
                <>
                    <div className="lista">
                        {baseFiltrada.length === 0 ? (
                            <p className="empty">Nenhum resultado encontrado.</p>
                        ) : (
                            paginar(baseFiltrada, paginaBase).map((item) => (
                                <div key={item.id} className="card__faq">
                                    <p><strong>Pergunta:</strong> {item.pergunta}</p>
                                    <p><strong>Resposta:</strong> {item.resposta}</p>
                                    <div className="card__acoes">
                                        <button onClick={() => copiarResposta(item.resposta)} className="btn__copiar">📋 Copiar</button>
                                        <button onClick={() => abrirModal(item)} className="btn__editar">✏️ Editar</button>
                                        <button onClick={() => excluirDaBase(item.id)} className="btn__excluir">🗑️ Excluir</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {/* ... Paginação Base ... */}
                    {totalPaginasBase > 1 && (
                        <div className="paginacao">
                            <button disabled={paginaBase === 1} onClick={() => setPaginaBase(p => p - 1)}> Anterior </button>
                            <span>Página {paginaBase} de {totalPaginasBase}</span>
                            <button disabled={paginaBase === totalPaginasBase} onClick={() => setPaginaBase(p => p + 1)}> Próxima </button>
                        </div>
                    )}
                </>
            )}

            {modalAberto && (
                <div className="modal__overlay">
                    <div className="modal__content">
                        <h3>{perguntaSelecionada.status ? "Responder Pergunta" : "Editar Resposta"}</h3>
                        <p><strong>Pergunta:</strong> {perguntaSelecionada?.pergunta}</p>
                        <textarea
                            className="resposta__textarea"
                            value={resposta}
                            onChange={(e) => setResposta(e.target.value)}
                            placeholder="Digite a resposta..."
                        />
                        <div className="modal__actions">
                            <button onClick={salvarResposta} className="btn__responder">Salvar</button>
                            <button onClick={() => setModalAberto(false)} className="btn__cancelar">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
            <ChatAdmin />
        </section>
    );
}

export default DashboardAdmin;