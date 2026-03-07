import React from 'react';
import Campo from '../Campo';
import Button from '../Button';
import Textarea from '../Textarea';
import Select from '../Select';

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

  return (
    <section id="contato" className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título da Seção */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">
            Vamos conversar?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Estou sempre aberto a novas oportunidades e colaborações. Preencha o formulário abaixo.
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campo Nome */}
              <Campo 
                label="Seu nome"
                placeholder="Carlos Nascimento"
              />
              
              {/* Campo E-mail */}
              <Campo 
                label="Seu e-mail"
                placeholder="email@exemplo.com"
                type="email"
              />

              {/* Campo Telefone (Opcional) */}
              <Campo 
                label="Telefone (Opcional)"
                placeholder="(XX) XXXXX-XXXX"
              />

              {/* Campo Serviços */}
              <Select 
                label="Assunto" 
                options={servicosOptions} 
              />
            </div>

            {/* Campo Mensagem */}
            <div className="mt-6">
              <Textarea 
                label="Sua mensagem"
                placeholder="Deixe sua mensagem aqui..."
              />
            </div>

            {/* Botão de Envio */}
            <div className="mt-8 text-center">
              <Button 
                text="Enviar Mensagem"
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contato;
