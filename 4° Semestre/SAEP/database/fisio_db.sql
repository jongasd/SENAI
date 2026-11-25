CREATE DATABASE IF NOT EXISTS fisio_db;
USE fisio_db;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE pacientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100),
    data_nascimento DATE
);

CREATE TABLE planos_tratamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT NOT NULL,
    descricao VARCHAR(150) NOT NULL,
    objetivo VARCHAR(200),
    qtd_sessoes INT NOT NULL,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);

CREATE TABLE sessoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plano_id INT NOT NULL,
    data_sessao DATETIME NOT NULL,
    observacoes VARCHAR(200),
    FOREIGN KEY (plano_id) REFERENCES planos_tratamento(id)
);

-- Senha padrão para todos os usuários de teste: 123456
INSERT INTO usuarios (nome, email, senha) VALUES
("Administrador", "admin@fisio.com", "$2b$10$RLJXYpsTA/Y8WdDAV/Awxu1Bot2G6jFVpHQ06M3cph9puBeFEkB0q"),
("Dr. Carlos Fisioterapeuta", "carlos@fisio.com", "$2b$10$RLJXYpsTA/Y8WdDAV/Awxu1Bot2G6jFVpHQ06M3cph9puBeFEkB0q"),
("Dra. Fernanda Recepcionista", "fernanda@fisio.com", "$2b$10$RLJXYpsTA/Y8WdDAV/Awxu1Bot2G6jFVpHQ06M3cph9puBeFEkB0q");

-- CPFs criptografados em AES-256-CBC (11122233344, 22233344455, 33344455566)
INSERT INTO pacientes (nome, cpf, telefone, email, data_nascimento) VALUES
("João da Silva", "1992da811eaff3f9faaa803b66ef3e53", "(11)95729-0221", "joao.silva@email.com", "1985-04-12"),
("Maria Souza", "1c35ecf209d7698ed1787baa2bb0be80", "(11)95101-6804", "maria.souza@email.com", "1992-09-23"),
("Pedro Oliveira", "4cf6422b5f2f5187996fecdd95e92c09", "(11)97376-9638", "pedro.oliveira@email.com", "1978-11-05");

INSERT INTO planos_tratamento (paciente_id, descricao, objetivo, qtd_sessoes) VALUES
(1, "Fisioterapia Ortopédica - Joelho", "Recuperação de mobilidade e fortalecimento muscular", 10),
(2, "Fisioterapia Postural (RPG)", "Correção postural e alívio de dor lombar", 8),
(3, "Fisioterapia Neurológica", "Reabilitação motora e equilíbrio", 12);

INSERT INTO sessoes (plano_id, data_sessao, observacoes) VALUES
(2, "2026-11-05 09:00:00", "Sessão inicial de alongamento e avaliação postural"),
(1, "2026-10-20 14:30:00", "Exercícios isométricos e crioterapia no joelho direito"),
(3, "2026-10-28 08:00:00", "Treino de marcha e propriocepção");
