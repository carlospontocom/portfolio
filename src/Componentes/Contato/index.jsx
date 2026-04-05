import React, { useState } from 'react';
import emailjs from '@emailjs/browser';


import Campo from '../Campo';
import Button from '../Button';
import Textarea from '../Textarea';
import Select from '../Select';
import ModalSucesso from '../ModalSucesso';
import { EMAILJS_CONFIG } from '../Config/EmailJS';

const Contato = () => {
  const servicosOptions = [
    'Selecionar serviço',
    'Suporte Técnico',
    'Desenvolvimento Frontend',
    'Desenvolvimento Backend',
    'Adicionar Funcionalidade',
    'Correções e Atualizações',
    'Dúvidas Gerais',
  ];

  const initialFormState = {
    nome: '',
    email: '',
    telefone: '',
    assunto: servicosOptions[0],
    mensagem: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Função de Máscara para Telefone (XX) XXXXX-XXXX
  const applyPhoneMask = (value) => {
    if (!value) return "";
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === 'telefone' ? applyPhoneMask(value) : value;

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.nome.trim()) tempErrors.nome = 'O campo nome é obrigatório.';

    if (!formData.email) {
      tempErrors.email = 'O campo e-mail é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'O e-mail informado é inválido.';
    }

    if (formData.telefone && formData.telefone.length < 14) {
      tempErrors.telefone = 'Telefone incompleto.';
    }

    if (formData.assunto === servicosOptions[0]) {
      tempErrors.assunto = 'Por favor, selecione um assunto.';
    }

    if (!formData.mensagem.trim()) {
      tempErrors.mensagem = 'O campo mensagem é obrigatório.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      setLoading(true);

      // Mapeamento dos campos para o seu template do EmailJS
      const templateParams = {
        from_name: formData.nome,
        from_email: formData.email,
        telefone: formData.telefone,
        subject: formData.assunto,
        message: formData.mensagem,
      };

      emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      )
        .then((response) => {
          console.log('Sucesso!', response.status, response.text);
          setShowModal(true);
          setFormData(initialFormState);
          setErrors({});
        })
        .catch((err) => {
          console.error('Erro ao enviar:', err);
          alert('Falha ao enviar e-mail. Verifique o console para detalhes.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <section id="contato" className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">Vamos conversar?</h2>
          <p className="mt-4 text-lg text-gray-600">
            Estou sempre aberto a novas oportunidades. Preencha o formulário abaixo.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Campo
                label="Seu nome"
                placeholder="Carlos Nascimento"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                error={errors.nome}
              />
              <Campo
                label="Seu e-mail"
                placeholder="email@exemplo.com"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <Campo
                label="Telefone (Opcional)"
                placeholder="(XX) XXXXX-XXXX"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                error={errors.telefone}
              />
              <Select
                label="Assunto"
                options={servicosOptions}
                name="assunto"
                value={formData.assunto}
                onChange={handleChange}
                error={errors.assunto}
              />
            </div>
            <div className="mt-6">
              <Textarea
                label="Sua mensagem"
                placeholder="Deixe sua mensagem aqui..."
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                error={errors.mensagem}
              />
            </div>
            <p className="text-center py-4 text-gray-600 text-sm">
              Retornamos contato em até 48hs após envio.
            </p>
            <div className="mt-8 text-center">
              <Button
                text={loading ? "Enviando..." : "Enviar Mensagem"}
                type="submit"
                disabled={loading}
              />
            </div>
          </form>
        </div>
      </div>

      {showModal && <ModalSucesso onClose={closeModal} />}
    </section>
  );
};

export default Contato;