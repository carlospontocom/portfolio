import React, { useState } from 'react';
import Card from '../Card';
import Modal from '../Modal';
import styles from './projeto.module.css';

// --- Ícones para os Cards ---
const CalendarIcon = () => (
  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
);

const BlogIcon = () => (
  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
);

const ChecklistIcon = () => (
  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-0 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);
// ---

const Projetos = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const projectData = [
    {
      title: 'Cadastro e login',
      icon: <CalendarIcon />,
      bgColor: 'bg-purple-600',
      description: 'Sistema para usuário proder acessar o sistemas e realizar atividades exclusivas e sessões',
      technologies: ['React JS', 'Firebase'],
      functionalities: ['Acesso restrito', 'Recuperação de senha por login', 'Criação de conta', 'Gerenciador de acesso'],
      demoLink: '#',
      modalContent: {
        detailedDescription: 'Sistema robusto foi desenvolvido para otimizar a gestão de usuários, para usuário acessar seu dashboard e ter acesso exclusivo aos serviços de sistemas',
        detailedFunctionalities: [
          { title: 'Login Interativo', description: 'Permite que os clientes acessam rapidamente sua área de acesso para poder gerenciar suas atividades internas no sistema' },
          { title: 'Notificações por Email', description: 'Confirmações, lembretes e avisos de cancelamento são enviados automaticamente, reduzindo o não comparecimento (no-show).' },
          { title: 'Cancelamento/Remarcação Flexível', description: 'Regras de negócio personalizáveis para cancelamentos e remarcações, dando autonomia ao usuário dentro de limites pré-definidos.' },
        ]
      }
    },
    {
      title: 'Chat',
      icon: <BlogIcon />,
      bgColor: 'bg-green-500',
      description: 'Plataforma de comunicação para clientes e administradores ou um sistema SAC',
      technologies: ['JavaScript', 'REST API', 'Firebase'],
      functionalities: ['Sistema de comunicação online', 'Atendimento ao cliente', 'Gestor de dúvidas'],
      demoLink: '#',
      modalContent: {
        detailedDescription: 'Uma plataforma completa para comunicação online entre clientes, parceiros e administradores. O projeto pode pensado para centralizar a comunicação e exclarecimento sobre assuntos relacionados ao tipo de sistemas, é flexível e totalmente prático.',
        detailedFunctionalities: [
          { title: 'Sistema de contatos', description: 'Engaje sua seus clientes com uma comunicação em tempo real, parceiros, clientes e outros.' },
          { title: 'Chat e Sac', description: 'Faça contato com os envolvidos nos processos da sua empresa, de forma centralizada e para reclarecimento em tempop real.' },
          { title: 'Dashboard com lista de contatos', description: 'Um painel central para gerenciar todas as comunicações, contatos e para visualizar usuários que enviaram ou podem ser contactados e com aviso de mensagens.' },
        ]
      }
    },



    {
      title: 'Checklist App',
      icon: <ChecklistIcon />,
      bgColor: 'bg-blue-500',
      description: 'Gerenciador de rotina empresarial',
      technologies: ['React', 'Node.js', 'Firebase'], // Ajustado para refletir as tecnologias citadas (Firestore/Auth são do Firebase) e o termo Fullstack
      functionalities: ['Sistema de login', 'Painel administrativo', 'Gerenciador de tarefas', 'Sincronização em tempo real', 'Gestor de clientes'],
      demoLink: '#',
      modalContent: {
        detailedDescription: 'Gestão empresarial ao integrar um sistema de login seguro a um painel administrativo analítico. A solução otimiza fluxos de trabalho através de um gerenciador de tarefas e um CRM de clientes, ambos atualizados via sincronização em tempo real.',
        detailedFunctionalities: [
          {
            title: 'Login Social Integrado',
            description: 'Autenticação rápida e segura via Firebase Auth (Google/Facebook), simplificando o acesso dos colaboradores com altos padrões de proteção de dados.'
          },
          {
            title: 'Gestão Avançada de Demandas',
            description: 'Criação e organização de fluxos de trabalho e listas de tarefas segmentadas por projetos, departamentos ou contas específicas de clientes.'
          },
          {
            title: 'Sincronização em Tempo Real',
            description: 'Utilizando o Firestore, qualquer alteração em uma lista é instantaneamente refletida em todos os dispositivos logados e no painel administrativo.'
          },
          {
            title: 'Modo Offline e Resiliência',
            description: 'Permite a consulta e edição de dados operacionais mesmo sem conexão com a internet, sincronizando tudo automaticamente com o servidor assim que a rede for restabelecida.'
          }
        ]
      }
    }
  ];

  const handleSaibaMaisClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const techColorMap = {
    'React JS': 'bg-blue-200 text-blue-800',
    'Node.js (Básico)': 'bg-green-200 text-green-800',
    'Firebase': 'bg-yellow-200 text-yellow-800',
    'JavaScript': 'bg-yellow-200 text-yellow-800',
    'REST API': 'bg-indigo-200 text-indigo-800',
    'Auth API': 'bg-pink-200 text-pink-800',
  };

  return (
    <section className={styles.containerProjeto} id="projetos">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">Meus Projetos</h2>
      <div className={styles.grid}>
        {projectData.map((project) => (
          <Card
            key={project.title}
            {...project}
            onSaibaMaisClick={() => handleSaibaMaisClick(project)}
          />
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedProject && selectedProject.modalContent && (
          <>
            <div className={`p-6 text-white flex items-center rounded-t-lg ${selectedProject.bgColor}`}>
              <div className="mr-4">{selectedProject.icon}</div>
              <h3 className="text-3xl font-bold">{selectedProject.title}</h3>
            </div>
            <div className="p-8">
              <p className="text-gray-700 text-lg mb-6">{selectedProject.modalContent.detailedDescription}</p>

              <h4 className="font-bold text-xl mb-4 text-gray-800">Tecnologias:</h4>
              <div className="flex flex-wrap gap-3 mb-6">
                {selectedProject.technologies.map(tech => (
                  <span key={tech} className={`px-4 py-1 text-sm font-semibold rounded-full ${techColorMap[tech] || 'bg-gray-200 text-gray-800'}`}>{tech}</span>
                ))}
              </div>

              <h4 className="font-bold text-xl mb-4 text-gray-800">Principais Funcionalidades:</h4>
              <ul className="space-y-4">
                {selectedProject.modalContent.detailedFunctionalities.map(func => (
                  <li key={func.title} className="flex items-start">
                    <CheckIcon />
                    <div>
                      <h5 className="font-semibold text-gray-800">{func.title}</h5>
                      <p className="text-gray-600">{func.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
};

export default Projetos;
