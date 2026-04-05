import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Campo from '../Campo';
import Button from '../Button';

// --- IMPORTS DO FIREBASE ---
import { auth, db } from '../Config/Firebase.js';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Cadastro = () => {
    const navigate = useNavigate();

    const [dados, setDados] = useState({
        nome: '',
        genero: '',
        email: '',
        telefone: '',
        cep: '',
        rua: '',
        bairro: '',
        cidade: '',
        uf: '',
        complemento: '',
        senha: '',
        confirmarSenha: ''
    });

    const [erros, setErros] = useState({});
    const [carregando, setCarregando] = useState(false);

    // Máscara para CEP
    const aplicarMascaraCep = (valor) => {
        let v = valor.replace(/\D/g, '');
        if (v.length <= 5) return v;
        return v.substring(0, 5) + '-' + v.substring(5, 8);
    };

    // Máscara para Telefone (melhorada)
    const aplicarMascaraTelefone = (valor) => {
        let v = valor.replace(/\D/g, '');
        v = v.substring(0, 11);

        if (v.length === 0) return '';
        if (v.length <= 2) return `(${v}`;
        if (v.length <= 3) return `(${v.substring(0, 2)})${v.substring(2)}`;
        if (v.length <= 7) return `(${v.substring(0, 2)}) ${v.substring(2, 3)} ${v.substring(3)}`;
        if (v.length <= 11) return `(${v.substring(0, 2)}) ${v.substring(2, 3)} ${v.substring(3, 7)}-${v.substring(7)}`;

        return `(${v.substring(0, 2)}) ${v.substring(2, 3)} ${v.substring(3, 7)}-${v.substring(7, 11)}`;
    };

    // Buscar CEP
    const buscarCep = async (cep) => {
        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length === 8) {
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                const data = await res.json();

                if (!data.erro) {
                    setDados(prev => ({
                        ...prev,
                        rua: data.logradouro || '',
                        bairro: data.bairro || '',
                        cidade: data.localidade || '',
                        uf: data.uf || ''
                    }));

                    // Limpar erro do CEP se existir
                    if (erros.cep) {
                        setErros(prev => ({ ...prev, cep: undefined }));
                    }
                } else {
                    setErros(prev => ({ ...prev, cep: 'CEP não encontrado' }));
                }
            } catch (e) {
                console.error("Erro ao buscar CEP:", e);
                setErros(prev => ({ ...prev, cep: 'Erro ao buscar CEP' }));
            }
        }
    };

    const handleChange = (campo, valor) => {
        let valorFinal = valor;

        if (campo === 'cep') {
            valorFinal = aplicarMascaraCep(valor);
            setDados({ ...dados, [campo]: valorFinal });
            buscarCep(valorFinal);
        } else if (campo === 'telefone') {
            valorFinal = aplicarMascaraTelefone(valor);
            setDados({ ...dados, [campo]: valorFinal });
            // Limpar erro do telefone
            if (erros.telefone) {
                setErros(prev => ({ ...prev, telefone: undefined }));
            }
        } else {
            setDados({ ...dados, [campo]: valorFinal });
            // Limpar erro do campo ao digitar
            if (erros[campo]) {
                setErros(prev => ({ ...prev, [campo]: undefined }));
            }
        }
    };

    const validarFormulario = () => {
        let novosErros = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Nome
        if (!dados.nome.trim()) {
            novosErros.nome = 'Nome é obrigatório.';
        } else if (dados.nome.trim().length < 3) {
            novosErros.nome = 'Nome deve ter pelo menos 3 caracteres.';
        }

        // Gênero
        if (!dados.genero) {
            novosErros.genero = 'Selecione o gênero.';
        }

        // Email
        if (!dados.email) {
            novosErros.email = 'E-mail é obrigatório.';
        } else if (!emailRegex.test(dados.email)) {
            novosErros.email = 'E-mail inválido. Exemplo: nome@email.com';
        }

        // Telefone
        const telefoneLimpo = dados.telefone.replace(/\D/g, '');
        if (!dados.telefone) {
            novosErros.telefone = 'Telefone é obrigatório.';
        } else if (telefoneLimpo.length < 10) {
            novosErros.telefone = 'Telefone incompleto. Use (DD) 9 9999-9999';
        } else if (telefoneLimpo.length === 10) {
            // Telefone fixo é aceito
            console.log("Telefone fixo válido");
        } else if (telefoneLimpo.length !== 11) {
            novosErros.telefone = 'Telefone deve ter 10 ou 11 dígitos.';
        }

        // Senha
        if (!dados.senha) {
            novosErros.senha = 'Senha é obrigatória.';
        } else if (dados.senha.length < 6) {
            novosErros.senha = 'Mínimo 6 caracteres.';
        }

        // Confirmar senha
        if (dados.senha !== dados.confirmarSenha) {
            novosErros.confirmarSenha = 'As senhas não coincidem.';
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    // --- LÓGICA DE SUBMIT COM FIREBASE ---
    const onSubmit = async (e) => {
        e.preventDefault();

        if (validarFormulario()) {
            setCarregando(true);

            try {
                console.log("Iniciando cadastro para:", dados.email);

                // 1. Criar usuário no Firebase Auth
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    dados.email,
                    dados.senha
                );
                const user = userCredential.user;

                console.log("Usuário criado no Auth. UID:", user.uid);

                // 2. Salvar dados adicionais no Firestore
                const userData = {
                    uid: user.uid,
                    nome: dados.nome,
                    genero: dados.genero,
                    email: dados.email,
                    telefone: dados.telefone,
                    endereco: {
                        cep: dados.cep || '',
                        rua: dados.rua || '',
                        bairro: dados.bairro || '',
                        cidade: dados.cidade || '',
                        uf: dados.uf || '',
                        complemento: dados.complemento || ''
                    },
                    tipoPerfil: 'usuario',
                    dataCriacao: new Date().toISOString(),
                    status: 'ativo'
                };

                await setDoc(doc(db, "usuarios", user.uid), userData);

                console.log("✅ Usuário cadastrado com sucesso!");
                alert("Conta criada com sucesso! Redirecionando...");

                // Aguardar um pouco antes de redirecionar
                setTimeout(() => {
                    navigate('/login');
                }, 1500);

            } catch (error) {
                console.error("❌ Erro no cadastro:", error.code, error.message);

                // Tratamento de erros específicos do Firebase
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        setErros({ email: 'Este e-mail já está em uso. Faça login ou use outro e-mail.' });
                        break;
                    case 'auth/weak-password':
                        setErros({ senha: 'Senha muito fraca. Use pelo menos 6 caracteres com letras e números.' });
                        break;
                    case 'auth/invalid-email':
                        setErros({ email: 'E-mail inválido. Verifique o formato.' });
                        break;
                    case 'auth/network-request-failed':
                        alert("Erro de rede. Verifique sua conexão com a internet.");
                        break;
                    default:
                        alert(`Erro ao cadastrar: ${error.message}\nTente novamente.`);
                }
            } finally {
                setCarregando(false);
            }
        } else {
            // Rolar para o primeiro erro
            const primeiroErro = document.querySelector('.text-red-500');
            if (primeiroErro) {
                primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-slate-50 pt-[60px] py-20 px-4">
            <form onSubmit={onSubmit} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-100">
                <header className="mb-8 border-b pb-4">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Criar Conta</h1>
                    <p className="text-slate-500 text-sm">Preencha seus dados para acessar a plataforma.</p>
                </header>

                {/* Nome e Gênero */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 mb-2">
                    <div className="md:col-span-2">
                        <Campo
                            label="Nome Completo"
                            placeholder="Nome Sobrenome"
                            value={dados.nome}
                            onChange={e => handleChange('nome', e.target.value)}
                            error={erros.nome}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-wider">
                            Gênero *
                        </label>
                        <select
                            className={`w-full p-[15px] border rounded-lg shadow-sm bg-white text-gray-700 outline-none transition-all ${erros.genero ? 'border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-indigo-400'
                                }`}
                            value={dados.genero}
                            onChange={e => handleChange('genero', e.target.value)}
                        >
                            <option value="">Selecione...</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Outro">Outro</option>
                        </select>
                        {erros.genero && <p className="text-red-500 text-xs italic mt-1">{erros.genero}</p>}
                    </div>
                </div>

                {/* Email e Telefone */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 mb-2">
                    <div className="md:col-span-2">
                        <Campo
                            label="E-mail"
                            type="email"
                            placeholder="exemplo@email.com"
                            value={dados.email}
                            onChange={e => handleChange('email', e.target.value)}
                            error={erros.email}
                            required
                        />
                    </div>
                    <div className="md:col-span-1">
                        <Campo
                            label="Telefone"
                            placeholder="(88) 9 9999-9999"
                            value={dados.telefone}
                            onChange={e => handleChange('telefone', e.target.value)}
                            error={erros.telefone}
                            required
                        />
                    </div>
                </div>

                {/* Seção de Endereço */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-x-4 p-6 bg-slate-50 pt-[60px] rounded-2xl border border-slate-200 mb-6">
                    <div className="md:col-span-2">
                        <Campo
                            label="CEP"
                            placeholder="00000-000"
                            value={dados.cep}
                            onChange={e => handleChange('cep', e.target.value)}
                            error={erros.cep}
                        />
                    </div>
                    <div className="md:col-span-4">
                        <Campo
                            label="Rua"
                            placeholder="Logradouro"
                            value={dados.rua}
                            onChange={e => handleChange('rua', e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <Campo
                            label="Bairro"
                            placeholder="Bairro"
                            value={dados.bairro}
                            onChange={e => handleChange('bairro', e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <Campo
                            label="Complemento"
                            placeholder="Apto, Bloco, etc."
                            value={dados.complemento}
                            onChange={e => handleChange('complemento', e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-4">
                        <Campo
                            label="Cidade"
                            placeholder="Cidade"
                            value={dados.cidade}
                            onChange={e => handleChange('cidade', e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Campo
                            label="UF"
                            placeholder="UF"
                            value={dados.uf}
                            onChange={e => handleChange('uf', e.target.value)}
                        />
                    </div>
                </div>

                {/* Segurança */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mb-6">
                    <Campo
                        label="Crie uma Senha"
                        type="password"
                        placeholder="••••••"
                        value={dados.senha}
                        onChange={e => handleChange('senha', e.target.value)}
                        error={erros.senha}
                        required
                    />
                    <Campo
                        label="Confirmar Senha"
                        type="password"
                        placeholder="••••••"
                        value={dados.confirmarSenha}
                        onChange={e => handleChange('confirmarSenha', e.target.value)}
                        error={erros.confirmarSenha}
                        required
                    />
                </div>

                <Button
                    text={carregando ? "Criando conta..." : "Finalizar e Entrar"}
                    type="submit"
                    disabled={carregando}
                    className={`w-full py-4 rounded-lg font-bold transition-all shadow-lg text-white ${carregando ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                />

                <div className="mt-4 text-center">
                    <p className="text-sm text-slate-500">
                        Já tem uma conta?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Faça login
                        </button>
                    </p>
                </div>
            </form>
        </section>
    );
};

export default Cadastro;