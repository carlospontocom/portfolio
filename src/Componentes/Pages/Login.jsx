import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Campo from '../Campo';
import Button from '../Button';

// --- IMPORTS DO FIREBASE ---
import { auth, db } from '../Config/Firebase.js';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const manipularLogin = async (e) => {
        e.preventDefault();
        setErro('');

        if (!email.includes('@')) {
            setErro('Por favor, insira um e-mail válido.');
            return;
        }
        if (password.length < 6) {
            setErro('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setCarregando(true);

        try {
            // 1. Autenticação no Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Busca permissão no Firestore
            // Estamos usando o e-mail como ID do documento na coleção 'permissoes'
            const docRef = doc(db, "permissoes", user.email.toLowerCase());
            const docSnap = await getDoc(docRef);

            console.log('Login realizado!');

            // 3. Lógica de Redirecionamento
            if (docSnap.exists() && docSnap.data().isAdmin === true) {
                navigate('/dashboard/admin');
            } else {
                navigate('/dashboard/usuario');
            }

        } catch (error) {
            console.error("Erro ao logar:", error.code);
            switch (error.code) {
                case 'auth/invalid-credential':
                    setErro('E-mail ou senha incorretos.');
                    break;
                case 'auth/too-many-requests':
                    setErro('Muitas tentativas. Tente mais tarde.');
                    break;
                default:
                    setErro('Ocorreu um erro ao acessar a conta.');
            }
        } finally {
            setCarregando(false);
        }
    };

    return (
        <section className="flex items-center justify-center h-screen bg-slate-50 pt-[60px] px-4">
            <form
                onSubmit={manipularLogin}
                className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-sm border border-slate-100"
            >
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                        Bem-vindo
                    </h1>
                    <p className="text-slate-500 text-sm mt-2">
                        Insira seus dados para acessar a plataforma
                    </p>

                    {erro && (
                        <div className="mt-4 p-2 bg-red-50 text-red-600 border border-red-100 rounded text-xs font-bold animate-pulse">
                            ⚠️ {erro}
                        </div>
                    )}
                </div>

                <Campo
                    label="E-mail"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={erro.includes('e-mail') || erro.includes('incorretos') ? ' ' : ''}
                />

                <Campo
                    label="Senha"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={erro.includes('senha') || erro.includes('incorretos') ? ' ' : ''}
                />

                <div className="mt-6">
                    <Button
                        text={carregando ? "Autenticando..." : "Entrar na conta"}
                        type="submit"
                        disabled={carregando}
                        className={`w-full text-white font-bold py-4 rounded-xl transition-all shadow-lg ${carregando ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'
                            }`}
                    />
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-400">
                        Não tem uma conta? <span className="text-indigo-600 font-bold cursor-pointer hover:underline" onClick={() => navigate('/cadastro')}>Cadastre-se</span>
                    </p>
                </div>

                <p className="text-center text-[10px] text-slate-300 mt-8 uppercase tracking-widest">
                    &copy; 2026 Sua Empresa
                </p>
            </form>
        </section>
    );
};

export default Login;

//suporte.tecnico.cn@gmail ... timtim12@
//intablete@gmail.com ... timtim