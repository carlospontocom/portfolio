import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../Config/Firebase.js";
import Campo from "../Campo";

const FormEmailRecorverSenha = () => {
    const [email, setEmail] = useState("");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [loading, setLoading] = useState(false);

    const recuperarSenha = async (e) => {
        e.preventDefault();

        setErro("");
        setSucesso("");

        if (!email.trim()) {
            setErro("Informe seu e-mail.");
            return;
        }

        // Validação simples do e-mail
        const regex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regex.test(email)) {
            setErro("Informe um e-mail válido.");
            return;
        }

        try {
            setLoading(true);

            await sendPasswordResetEmail(auth, email);

            setSucesso(
                "Foi enviado um link para recuperação de senha para o seu e-mail."
            );

            setEmail("");
        } catch (error) {
            switch (error.code) {
                case "auth/user-not-found":
                    setErro("Nenhum usuário encontrado com esse e-mail.");
                    break;

                case "auth/invalid-email":
                    setErro("E-mail inválido.");
                    break;

                case "auth/too-many-requests":
                    setErro(
                        "Muitas tentativas. Aguarde alguns minutos e tente novamente."
                    );
                    break;

                default:
                    setErro("Erro ao enviar o e-mail de recuperação.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="pt-[10rem] max-w-[400px] mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Recuperação de senha
            </h2>

            <form onSubmit={recuperarSenha}>
                <Campo
                    type="email"
                    label="E-mail"
                    name="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {erro && (
                    <p className="text-red-500 text-sm mt-2">
                        {erro}
                    </p>
                )}

                {sucesso && (
                    <p className="text-green-600 text-sm mt-2">
                        {sucesso}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded mt-5 hover:bg-blue-600 transition disabled:opacity-60"
                >
                    {loading ? "Enviando..." : "Enviar e-mail"}
                </button>
            </form>
        </section>
    );
};

export default FormEmailRecorverSenha;