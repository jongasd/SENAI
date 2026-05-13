create database educatech;
use educatech;
create table tbl_alunos (
email_alumo varchar(100) primary key not null,
nome_completo char,
cpf_aluno varchar(14),
data_nascimento date
);
create table tbl_matriculas (
codigo_matricula varchar(100) primary key not null,
data_matricula date,
status_matricula char (10),
email_aluno varchar(100) not null
);
create table tbl_cursos (

codigo_curso varchar(100) primary key not null,
titulo_curso varchar(500),
carga_horaria integer (1000),
dificuldade_curso char (20),
codigo_instrutor varchar(100) not null,
codigo_matricula varchar(100) not null
);
create table tbl_instrutor (
codigo_instrutor varchar(100) primary key not null,
nome_completo_instrutor char(100),
biografia_instrutor varchar(10000)
);
create table tbl_aulas (
ordem_aula integer(20) primary key not null,
codigo_curso varchar(100) primary key not null,
titulo_aula char(200),
link_videoaula varchar(500)
);