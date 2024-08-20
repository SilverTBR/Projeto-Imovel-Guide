
create database if not exists imovelGuide;
use imovelguide;

create table if not exists corretores (
id int not null primary key auto_increment,
name varchar(90) not null,
CPF varchar(11) not null,
creci varchar(20) not null 
);




