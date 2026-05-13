CREATE TABLE tbl_livros
(
    ISBN VARCHAR(50) PRIMARY KEY UNIQUE,
    titulo_livro VARCHAR(200) NOT NULL,
    ano_publicacao INT(4),
    editora_livro VARCHAR(50)
);

CREATE TABLE tbl_autor
(
    id_autor INT AUTO_INCREMENT PRIMARY KEY,
    nome_autor VARCHAR (100),
	nacionalidade_autor VARCHAR
    (50)
);

    CREATE TABLE tbl_qntd_livro
    (
        ISBN VARCHAR(50) NOT NULL,
        id_autor INT NOT NULL,
        quantidade_livro INT NOT NULL,

        CONSTRAINT FK_ISBN FOREIGN KEY (ISBN) REFERENCES tbl_livros(ISBN),
        CONSTRAINT FK_autor FOREIGN KEY (id_autor) REFERENCES tbl_autor(id_autor)
    );

    CREATE TABLE tbl_exemplar
    (
        id_exemplar VARCHAR(50) PRIMARY KEY,
        ISBN VARCHAR(50) NOT NULL,
        status_exemplar VARCHAR(10) NOT NULL,

        CONSTRAINT FK_ISBN_Exemplar FOREIGN KEY (ISBN) REFERENCES tbl_livros(ISBN)
    );
    CREATE TABLE tbl_emprestimo
    (
        matricula_aluno VARCHAR(50) NOT NULL,
        id_exemplar VARCHAR(50) NOT NULL,
        data_emprestimo DATE NOT NULL,
        data_devolucao DATE NOT NULL,
        data_devolucao_real DATE NULL
    );
    CREATE TABLE tbl_membros
    (
        matricula_aluno VARCHAR(50) PRIMARY KEY UNIQUE,
        nome_completo VARCHAR(100) NOT NULL,
        endereco_aluno VARCHAR(200),
        telefone_contato VARCHAR(20)
    );