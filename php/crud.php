<?php
require "bd.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        $qry = "INSERT INTO corretores (name, CPF, creci) VALUES (?,?,?)";

        $nome = $_POST["nome"];
        $cpf = $_POST["CPF"];
        $creci = $_POST["creci"];

        $conexao = conectarBD();
        $nQry = $conexao->prepare($qry);
        $nQry->bindValue(1, $nome);
        $nQry->bindValue(2, $cpf);
        $nQry->bindValue(3, $creci);

        if ($nQry->execute()) {
            echo json_encode (['success' => true, 'msg' => "Cadastro realizado com sucesso!"]);
        } else {
            echo json_encode (['success' => false, 'msg' => "Erro ao cadastrar corretor."]);
        }

    } catch (PDOException $e) {
        return json_encode(['success' => false, 'msg' => $e->getMessage()]);
    }
} elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
    try {
        $qry = "SELECT * FROM corretores";

        $conexao = conectarBD();
        $nQry = $conexao->prepare($qry);

        if ($nQry->execute()) {
            $resultado = $nQry->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'data' => $resultado]);
        } else {
            echo json_encode(['success' => false, 'msg' => "Erro ao buscar corretores."]);
        }

    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'msg' => $e->getMessage()]);
    }
} 
elseif ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    try {

        $qry = "DELETE FROM corretores WHERE id = ?";

        $id = $_GET['id'];

        $conexao = conectarBD();
        $nQry = $conexao->prepare($qry);
        $nQry->bindValue(1, $id);


        if ($nQry->execute()) {
            echo json_encode(['success' => true, 'msg' => "Exclusão de corretor feita com sucesso."]);
        } else {
            echo json_encode(['success' => false, 'msg' => "Erro ao excluir corretores."]);
        }

    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'msg' => $e->getMessage()]);
    }
} 
elseif ($_SERVER["REQUEST_METHOD"] == "PUT") {
    try {

        $qry = "UPDATE corretores SET name = ?, CPF = ?, creci = ? WHERE ID = ?";

        $id = $_GET['id'];
        $nome = $_GET['nome'];
        $cpf = $_GET["CPF"];
        $creci = $_GET["creci"];


        $conexao = conectarBD();
        $nQry = $conexao->prepare($qry);

        $nQry->bindValue(1, $nome);
        $nQry->bindValue(2, $cpf);
        $nQry->bindValue(3, $creci);
        $nQry->bindValue(4, $id);

        if ($nQry->execute()) {
            echo json_encode(['success' => true, 'msg' => "Edição do corretor feita com sucesso."]);
        } else {
            echo json_encode(['success' => false, 'msg' => "Erro ao realizar edição no corretor."]);
        }

    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'msg' => $e->getMessage()]);
    }
}
?>
