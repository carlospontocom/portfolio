import { useState, useEffect } from 'react';
import { db } from '../Config/Firebase';
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    updateDoc
} from "firebase/firestore";

const HookChat = (chatId) => {
    const [mensagens, setMensagens] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!chatId) return;

        setLoading(true);
        const mensagensRef = collection(db, "chats", chatId, "mensagens");
        const q = query(mensagensRef, orderBy("enviadoEm", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const mgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMensagens(mgs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [chatId]);

    // 2. Enviar nova mensagem
    const enviarMensagem = async (texto, uid, nome) => {
        if (!texto.trim() || !chatId) return;

        try {
            await addDoc(collection(db, "chats", chatId, "mensagens"), {
                texto: texto.trim(),
                remetenteId: uid,
                remetenteNome: nome,
                enviadoEm: serverTimestamp(),
            });

            await updateDoc(doc(db, "chats", chatId), {
                ultimaMensagemEm: serverTimestamp()
            });

        } catch (error) {
            console.error("Erro ao enviar:", error);
        }
    };

    return {
        mensagens,
        loading,
        enviarMensagem
    };
};

export default HookChat;