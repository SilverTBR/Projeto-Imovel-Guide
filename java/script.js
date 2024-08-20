let editavel = false;

const getID = () => {
    return document.getElementById("id").value
}

const getNome = () => {
    return document.getElementById("Nome").value
}

const getCPF = () => {
    return document.getElementById("CPF").value
}

const getCreci = () => {
    return document.getElementById("Creci").value
}

const clear = () => {
    document.getElementById("Nome").value = ""
    document.getElementById("CPF").value = ""
    document.getElementById("Creci").value = ""
    if(editavel){
        document.getElementById("Titulo").innerText = "Cadastro de Corretor";
        document.getElementById("cadastrar").innerText = "Enviar";
        document.getElementById("tabela").classList.remove("hidden")
        editavel = false;
    }
}

const ativarAviso = (funcionou, msg) => {
    let aviso = document.getElementById("Aviso");
    aviso.classList.remove('hidden');
    aviso.style.backgroundColor = funcionou === true ? '#4CAF50' : '#f44336';
    document.getElementById("textoAviso").innerText = msg
}

const validarFormulario = () => {
    let nome = getNome();
    let cpf = getCPF();
    let creci = getCreci();

    if (!nome || !cpf || !creci) {
        ativarAviso(false, "Por favor, preencha todos os campos.");
        return false;
    }

    if (cpf.trim().length < 11) {
        ativarAviso(false, "CPF inválido. Deve conter exatamente 11 caracteres.");
        return false;
    }

    if (nome.trim().length < 2) {
        ativarAviso(false, "Nome inválido. Deve conter pelo menos 2 caracteres.");
        return false;
    }

    
    if (creci.trim().length < 2) {
        ativarAviso(false, "Creci inválido. Deve conter pelo menos 2 caracteres.");
        return false;
    }

    return true;
}

const deletarCorretor = async (id) => {
    let resposta = await fetch("../php/crud.php?id="+id, {
        method: "DELETE"
    })

    if(resposta.ok){
        let json = await resposta.json();
        console.log(json)
        ativarAviso(json.success, json.msg);
        if(json.success){
           await carregarCorretores();  
        }
    }else{
        ativarAviso(false, "Erro realizar o Fetch de delete. Problema interno");
    }
}

const gerarRow = (corretor) => {
    const row = document.createElement("tr");
    row.innerHTML = ""

    const celulaID = document.createElement("td");
    celulaID.innerHTML = corretor.id;
    row.append(celulaID)

    const celulaNome = document.createElement("td");
    celulaNome.innerHTML = corretor.name;
    row.append(celulaNome)

    const celulaCreci = document.createElement("td");
    celulaCreci.innerHTML = corretor.creci;
    row.append(celulaCreci)

    const celulaCPF = document.createElement("td");
    celulaCPF.innerHTML = corretor.CPF;
    row.append(celulaCPF)

    const celulaEdicao = document.createElement("td");
    const botaoEditar = document.createElement("button");
    botaoEditar.textContent = "Editar";
    botaoEditar.classList.add("edita");
    botaoEditar.addEventListener("click", () => {
        solicitarEdicao(corretor);
    });
    celulaEdicao.appendChild(botaoEditar);
    row.appendChild(celulaEdicao);

    const celulaExclusao = document.createElement("td");
    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.classList.add("delete");
    botaoExcluir.addEventListener("click", () => {
        deletarCorretor(corretor.id);
    });
    celulaExclusao.appendChild(botaoExcluir);
    row.appendChild(celulaExclusao);


    return row;
}


const carregarCorretores = async () => {
    let resposta = await fetch("../php/crud.php", {
        method: "GET"
    });

    if (resposta.ok) {
        let json = await resposta.json();
        if (json.success) {
            let tabela = document.getElementById("tabela");
            tabela.innerHTML = ""; 

            if (tabela.getElementsByTagName("tr").length === 0) {
                const header = document.createElement("tr");

                const celulaID = document.createElement("th");
                celulaID.textContent = "ID";
                header.appendChild(celulaID);
            
                const celulaNome = document.createElement("th");
                celulaNome.textContent = "Nome";
                header.appendChild(celulaNome);

                const celulaCreci = document.createElement("th");
                celulaCreci.textContent = "Creci";
                header.appendChild(celulaCreci);

                const celulaCPF = document.createElement("th");
                celulaCPF.textContent = "CPF";
                header.appendChild(celulaCPF);

                const celulaEdicao = document.createElement("th");
                celulaEdicao.textContent = "Edição";
                header.appendChild(celulaEdicao);

                const celulaExclusao = document.createElement("th");
                celulaExclusao.textContent = "Exclusão";
                header.appendChild(celulaExclusao);

                tabela.appendChild(header);
            }

            json.data.forEach(corretor => {
                tabela.appendChild(gerarRow(corretor));
            });
        }
    } else {
        ativarAviso(false, "Erro realizar o Fetch de select. Problema interno");
    }
}

const solicitarEdicao = (corretor) => {

    editavel = true;    
    document.getElementById("Titulo").innerText = "Editar Corretor";
    document.getElementById("cadastrar").innerText = "Salvar";
    document.getElementById("tabela").classList.add("hidden")
    document.getElementById("id").value = corretor.id
    document.getElementById("CPF").value = corretor.CPF
    document.getElementById("Nome").value = corretor.name 
    document.getElementById("Creci").value = corretor.creci
}



document.getElementById("cadastrar").addEventListener("click", async () => {

    let resposta = null

    if (!validarFormulario()) {
        return;
    }

    let data = new FormData();
    data.append('nome', getNome());
    data.append('CPF', getCPF());
    data.append('creci', getCreci());
    
    console.log(data);


    if(!editavel){
        resposta = await fetch("../php/crud.php", {
            method: "POST",
            body: data
        })
    }else{
        let id = document.getElementById("id").value;
        resposta = await fetch("../php/crud.php?id="+id+"&nome="+getNome()+"&CPF="+getCPF()+"&creci="+getCreci(), {
            method: "PUT",
            body: data 
        })
    }

    console.log(resposta);

    
    if(resposta.ok){
        let json = await resposta.json();
        console.log(json)
        ativarAviso(json.success, json.msg);
        clear();
        if(json.success){
            carregarCorretores();  
        }
    }else{
        ativarAviso(false, "Erro realizar o Fetch de insert. Problema interno");
    }

})




window.onload = () => {
    carregarCorretores() 
}


