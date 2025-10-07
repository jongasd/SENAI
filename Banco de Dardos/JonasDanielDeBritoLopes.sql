create database saber_e_cia;
use saber_e_cia;
create table tbl_livros (
ISBN VARCHAR(50) primary key unique,
titulo_livro varchar(200) not null,
ano_publicacao integer(4),
editora_livro varchar(50)
);
create table tbl_qntd_livro (
ISBN VARCHAR(50) not null,
id_autor VARCHAR(50) not null,
quantidade_livro integer not null
);
create table tbl_autor(
id_autor varchar(50),
nome_autor varchar(100),
nacionalidade_autor varchar(50)
);
create table tbl_exemplar (
id_exemplar varchar(50) primary key unique,
ISBN varchar(50) not null,
status_exemplar varchar(10) not null
);
create table tbl_emprestimo (
matricula_aluno varchar(50) not null,
id_exemplar varchar(50) not null,
data_emprestimo date not null,
data_devolucao date not null,
data_devolucao_real date null
);
create table tbl_membros (
matricula_aluno varchar(50) primary key unique,
nome_completo varchar(100) not null,
endereço_aluno varchar(200),
telefone_contato varchar(20)
);

CREATE USER 'estagiario'@'localhost' identified by 'mudar123';
grant alter on tbl_livros to 'estagiario'@'localhost';
ALTER TABLE tbl_livros ADD genero VARCHAR(50);