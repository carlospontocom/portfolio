import React, { useEffect, useState } from 'react';
import { db } from '../../Config/Firebase';
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const ListaPerguntadores = () => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const refBase = collection(db, "base_conhecimento");

        // Listener em tempo real na base_conhecimento
        const unsubscribe = onSnapshot(refBase, (snapshot) => {
            const dados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Agrupar por email
            const agrupados = dados.reduce((acc, item) => {
                const email = item.usuarioEmail || "desconhecido";
                if (!acc[email]) {
                    acc[email] = 0;
                }
                acc[email] += 1;
                return acc;
            }, {});

            // Converter em array para renderizar
            const lista = Object.entries(agrupados).map(([email, quantidade]) => ({
                email,
                quantidade
            }));

            setUsuarios(lista);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="bg-slate-100 p-6 rounded-xl mt-8">
            <h3 className="text-xl font-bold mb-4">Perguntadores (respondidas)</h3>
            {usuarios.length === 0 ? (
                <p className="text-slate-600">Nenhum usuário tem perguntas respondidas ainda.</p>
            ) : (
                <ul className="space-y-2">
                    {usuarios.map((u, idx) => (
                        <li key={idx} className="flex justify-between border-b pb-1 text-sm text-slate-700">
                            <span>{u.email}</span>
                            <span className="font-bold">{u.quantidade} respostas</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ListaPerguntadores;
