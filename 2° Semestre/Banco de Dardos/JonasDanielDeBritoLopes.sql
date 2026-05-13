-- Criando banco de dados e selecionando
CREATE DATABASE saber_e_cia;
USE saber_e_cia;

---------------------------------------
-- 📚 TABELA LIVROS
---------------------------------------

CREATE TABLE tbl_livros
(
    ISBN VARCHAR(50) PRIMARY KEY UNIQUE,
    titulo_livro VARCHAR(200) NOT NULL,
    ano_publicacao INT(4),
    editora_livro VARCHAR(50)
);

-- Inserindo livros
INSERT INTO tbl_livros
    (ISBN, titulo_livro, ano_publicacao, editora_livro)
VALUES
    ('123456', 'Harry Potter 01', 2009, 'Saraiva'),
    ('978-85-7126-061-0', 'Dom Casmurro', 1899, 'Editora Clássica');

-- Inserindo mais livros
INSERT INTO tbl_livros
    (ISBN, titulo_livro, ano_publicacao, editora_livro)
VALUES
    ('978-85-325-2306-8', 'A Revolução dos Bichos', 1945, 'Companhia das Letras'),
    ('978-0-00-711711-0', '1984', 1949, 'Penguin Books'),
    ('978-85-325-1997-9', 'Eu, Robô', 1950, 'Aleph'),
    ('999-99-999-9999-9', 'AAAA', 1900, 'Aleph');

---------------------------------------
-- 🧑‍💼 TABELA AUTORES
---------------------------------------
CREATE TABLE tbl_autor
(
    id_autor INT
    AUTO_INCREMENT PRIMARY KEY,
    nome_autor VARCHAR
    (100),
    nacionalidade_autor VARCHAR
    (50)
);

    -- Inserindo autores
    INSERT INTO tbl_autor
        (nome_autor, nacionalidade_autor)
    VALUES
        ('Clarice Lispector', 'Brasileira'),
        ('George Orwell', 'Britânico'),
        ('Isaac Asimov', 'Russo-Americano');


    ---------------------------------------
    -- 📦 TABELA QUANTIDADE DE LIVROS
    ---------------------------------------
    CREATE TABLE tbl_qntd_livro
    (
        ISBN VARCHAR(50) NOT NULL,
        id_autor INT NOT NULL,
        quantidade_livro INT NOT NULL,

        CONSTRAINT FK_ISBN FOREIGN KEY (ISBN) REFERENCES tbl_livros(ISBN),
        CONSTRAINT FK_autor FOREIGN KEY (id_autor) REFERENCES tbl_autor(id_autor)
    );
    insert into tbl_qntd_livro
        (ISBN, id_autor, quantidade_livro)
    values
        ('123456', 1, 10),
        ('978-85-7126-061-0', 2, 100),
        ('978-85-325-2306-8', 3, 34),
        ('978-0-00-711711-0', 3, 10);

    ---------------------------------------
    -- 📕 TABELA EXEMPLAR
    ---------------------------------------
    CREATE TABLE tbl_exemplar
    (
        id_exemplar VARCHAR(50) PRIMARY KEY,
        ISBN VARCHAR(50) NOT NULL,
        status_exemplar VARCHAR(10) NOT NULL,

        CONSTRAINT FK_ISBN_Exemplar FOREIGN KEY (ISBN) REFERENCES tbl_livros(ISBN)
    );

    INSERT INTO tbl_exemplar
        (id_exemplar, ISBN, status_exemplar)	
    VALUES
        ('01', '123456', 'Emprestimo');

    ---------------------------------------
    -- 📑 TABELA EMPRESTIMO
    ---------------------------------------
    CREATE TABLE tbl_emprestimo
    (
        matricula_aluno VARCHAR(50) NOT NULL,
        id_exemplar VARCHAR(50) NOT NULL,
        data_emprestimo DATE NOT NULL,
        data_devolucao DATE NOT NULL,
        data_devolucao_real DATE NULL
    );

    ---------------------------------------
    -- 🧍 TABELA MEMBROS
    ---------------------------------------
    CREATE TABLE tbl_membros
    (
        matricula_aluno VARCHAR(50) PRIMARY KEY UNIQUE,
        nome_completo VARCHAR(100) NOT NULL,
        endereco_aluno VARCHAR(200),
        telefone_contato VARCHAR(20)
    );

    -- Inserindo membros
    INSERT INTO tbl_membros
        (matricula_aluno, nome_completo, endereco_aluno, telefone_contato)
    VALUES
        ('101', 'Ana Silva', 'Rua A, 123', '11-98765-4321'),
        ('102', 'Bruno Costa', 'Av. B, 456', '11-91234-5678'),
        ('103', 'Carla Dias', 'Praça C, 789', '11-95555-4444');

    ---------------------------------------
    -- ALTERAÇÕES, CONSULTAS E EXCLUSÕES
    ---------------------------------------

    -- Atualizando livro
    UPDATE tbl_livros
SET titulo_livro = 'Harry Potter 03'
WHERE ISBN = '978-85-7126-061-0';

    -- Consulta com filtro
    SELECT *
    FROM tbl_livros
    WHERE ano_publicacao > 2000;

    -- Atualizando publicação
    UPDATE tbl_livros
SET ano_publicacao = 2019
WHERE ISBN = '12354';

    -- Deletando livro
    DELETE FROM tbl_livros WHERE ISBN = '123456';

    -- Listar livros
    SELECT *
    FROM tbl_livros;

    -- Dropar tabelas
    DROP TABLE tbl_autor;
    DROP TABLE tbl_qntd_livro;
    DROP TABLE tbl_livros;
    DROP TABLE tbl_exemplar;
    DROP TABLE tbl_emprestimo;

    -- Consultas livros
    SELECT *
    FROM tbl_livros
    WHERE ano_publicacao BETWEEN 1940 AND 1944;

    SELECT *
    FROM tbl_livros
    WHERE editora_livro IN ('Rocco', 'Aleph');

            select titulo_livro 
AS titulo, 'Livro' AS tipo
        FROM tbl_livros
    UNION
        Select nome_completo AS nome, 'membro' AS tipo
        FROM tbl_membros;
    SELECT editora_livro, COUNT(ISBN) AS quantidade_livro
    FROM tbl_livros
    GROUP BY editora_livro;
    select titulo_livro, editora_livro, max(ano_publicacao) as ano_publicacao
    from tbl_livros
    group by editora_livro
    having count(isbn) >= 2;
    -- Consultar autores
    select nacionalidade_autor, count(*) as quantidade_autor
    from tbl_autor
    group by nacionalidade_autor;

    select L.titulo_livro, A.nome_autor
    from tbl_livros L
        Inner join tbl_qntd_livro AL
        on L.isbn = AL.isbn
        Inner join tbl_autor A
        on AL.id_autor = A.id_autor;

    select L.titulo_livro, A.nome_autor
    from tbl_livros L
cross join tbl_autor A;

    -- Consultas membros
    SELECT *
    FROM tbl_membros
    WHERE nome_completo LIKE '%Silva';
    SELECT *
    FROM tbl_membros
    WHERE nome_completo LIKE 'Ana%';
    SELECT UPPER(nome_completo), telefone_contato
    FROM tbl_membros;

    -- Deletar membro
    DELETE FROM tbl_membros WHERE matricula_aluno = '102';

    -- Mostrar tabela
    SELECT *
    FROM tbl_membros;

    -- ============================
    --  Ajustes / Inserções (correções)
    -- ============================

    -- 1) Inserir autor (corrigido: coluna é nacionalidade_autor)
    INSERT INTO tbl_autor
        (nome_autor, nacionalidade_autor)
    VALUES
        ('Frank Herbert', 'Americano');

    -- 2) Inserir exemplares (ordem/nomes de colunas conforme tbl_exemplar)
    INSERT INTO tbl_exemplar (id_exemplar, ISBN, status_exemplar)
    VALUES
        ('101', '978-85-325-2306-8', 'Disponível'),
        ('102', '978-0-00-711711-0', 'Emprestado'),
        ('103', '978-85-325-1997-9', 'Disponível');

    -- 3) Inserir empréstimo (ajustado aos nomes reais das colunas da tabela tbl_emprestimo)
    INSERT INTO tbl_emprestimo
        (matricula_aluno, id_exemplar, data_emprestimo, data_devolucao, data_devolucao_real)
    VALUES
        ('101', '102', '2024-10-01', '2024-10-15', NULL);

    -- ============================
    --  Exercício 2: GROUP BY
    --  Quantos exemplares (cópias) temos de cada livro?
    -- ============================
    SELECT
        ISBN,
        COUNT(*) AS total_exemplares
    FROM tbl_exemplar
    GROUP BY ISBN;	

    -- ============================
    --  Exercício 3: INNER JOIN (Relatório de Empréstimos)
    --  Mostrar: nome do membro, título do livro, data de vencimento (data_devolucao)
    --  Junções: tbl_membros -> tbl_emprestimo -> tbl_exemplar -> tbl_livros
    -- ============================
    SELECT
        M.nome_completo        AS nome_membro,
        L.titulo_livro         AS titulo_livro,
        E.data_devolucao       AS data_vencimento
    FROM tbl_membros AS M
        INNER JOIN tbl_emprestimo AS E ON M.matricula_aluno = E.matricula_aluno
        INNER JOIN tbl_exemplar AS Ex ON E.id_exemplar = Ex.id_exemplar
        INNER JOIN tbl_livros AS L ON Ex.ISBN = L.ISBN;

    -- ============================
    --  Exercício 4: LEFT JOIN (Autores e quantidade de títulos)
    --  Mostrar todos os autores e quantos títulos cada um tem (Frank Herbert deve aparecer com 0)
    --  Usa-se tbl_qntd_livro como relação Autor ⇄ Livro
    -- ============================
    SELECT
        A.nome_autor,
        COUNT(DISTINCT Q.ISBN) AS total_titulos
    FROM tbl_autor AS A
        LEFT JOIN tbl_qntd_livro AS Q ON A.id_autor = Q.id_autor
    GROUP BY A.nome_autor
    ORDER BY A.nome_autor;

    -- ============================
    --  Exercício 5: Subquery com IN
    --  Mostrar nomes dos membros que atualmente têm empréstimo ativo
    --  (data_devolucao_real IS NULL)
    -- ============================
    SELECT nome_completo
    FROM tbl_membros
    WHERE matricula_aluno IN (
  SELECT matricula_aluno
    FROM tbl_emprestimo
    WHERE data_devolucao_real IS NULL
);
Start transaction;
update tbl_membros set telefone_contato = '11-99999-00000' where matricula_aluno = '101';

COMMIT;

    ---------------------------------------
    -- 👤 USUÁRIO E PERMISSÃO
    ---------------------------------------
    CREATE USER 'estagiario'@'localhost' IDENTIFIED BY 'mudar123';
    GRANT ALTER ON tbl_livros TO 'estagiario'@'localhost';

    -- Adicionar coluna gênero
    ALTER TABLE tbl_livros ADD genero VARCHAR(50);

    use db_escola;
    create user 'secretaria'@'localhost' identified by 'Escola@Sec1';
    create user 'professor'@'localhost' identified by 'Escola@Prof2';

    grant all privileges on tbl_alunos to 'secretaria'@'localhost';
    grant select on tbl_alunos to 'professor'@'localhost';
    grant update, select on tbl_alunos to 'professor'@'localhost';
    revoke all privileges on db_escola.tbl_alunos from 'secretaria'@'localhost';

