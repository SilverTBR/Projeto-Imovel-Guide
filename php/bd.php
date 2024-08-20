<?php
function conectarBD($banco = "imovelguide"){
    $servidor = "localhost";
    $usuario = "root";
    $senha = "1234";

    try{
        $conexao = new PDO("mysql:host=$servidor;dbname=$banco;user=$usuario;password=$senha");
        return $conexao;
    }catch (PDOException $e){
        echo "Error" . $e->getMessage();
    }
}


?>