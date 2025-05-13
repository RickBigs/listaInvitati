let listaInvitati = [];

window.addEventListener("load", () => {
    let storaged = JSON.parse(localStorage.getItem("listaInvitati"));
    if (storaged){
        listaInvitati = storaged;
    }
    aggiornaLista();
});


let formInvitati = document.getElementById("formInvitati");

function aggiungiInvitato(event) {

    event.preventDefault();

    let nome = document.getElementById("nome").value.trim();
    let cognome = document.getElementById("cognome").value.trim();
    let email = document.getElementById("email").value.trim();

    if (nome && cognome && email){
        let invitato = {
            "nome": nome,
            "cognome": cognome,
            "email": email,
            "confermato": false
        };
        listaInvitati.push(invitato);
        aggiornaLista();
        formInvitati.reset();
    }
}

function ordina() {
    //ordina vettore in base al cognome e al nome
    listaInvitati.sort((a,b) =>{
       if (a.cognome < b.cognome) 
        return -1;
       else if (a.cognome > b.cognome) 
        return 1;
       else {
        if (a.nome < b.nome) 
        return -1;
       else if (a.nome > b.nome) 
        return 1;
        else 
        return 0
        }
    });

    aggiornaLista();
}

    function aggiornaLista() {

    let lista = document.getElementById("lista");
    let filtra = document.getElementById("filtra").value;
    let cerca = document.getElementById("cerca").value.trim();
    while(lista.firstChild){
        lista.removeChild(lista.firstChild);
    }

    for (let i = 0; i < listaInvitati.length; i++){
    if (filtra === "T" || (filtra==="C" && listaInvitati[i].confermato) || (filtra==="NC" && !listaInvitati[i].confermato)){
    if (!cerca || `${listaInvitati[i].nome} - ${listaInvitati[i].cognome} - ${listaInvitati[i].email}`.toLowerCase().includes(cerca.toLowerCase())){
    let li = document.createElement("li");
    let confermato = listaInvitati[i].confermato ? "checked" : "";
    li.innerHTML = `${listaInvitati[i].nome} - ${listaInvitati[i].cognome} - ${listaInvitati[i].email} <input type ="checkbox" ${confermato}> <button style=background-color:red>X</button>`;

    if (confermato)
    li.classList.add("confermato");
    else
    li.classList.add("nonConfermato");

    let checkbox = li.querySelector("input[type='checkbox']");
    checkbox.addEventListener("input",() => {
        listaInvitati[i].confermato = checkbox.checked;
        aggiornaLista();
    });

    let button = li.querySelector("button");
    button.addEventListener("click", () => {
        listaInvitati.splice(i,1);
        aggiornaLista();
    });

    lista.appendChild(li);
    }
    aggiornaLocalStorage()
    }
    }
}

function aggiornaLocalStorage(){
    localStorage.setItem("listaInvitati", JSON.stringify(listaInvitati));
}

function esporta() {
    let csv = "Nome, Cognome, Email, Confermato\n";
    let invitatiStr = listaInvitati.map((inv) => {
    return `${inv.nome}, ${inv.cognome}, ${inv.email}, ${inv.confermato}`
    });
    csv += invitatiStr.join("\n");
    let csvfile = new Blob([csv],{type: "text/csv"});
    let downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(csvfile);
    downloadLink.download = "listainvitati.csv";
    downloadLink.click();
    downloadLink.remove();
}

formInvitati.addEventListener("submit",aggiungiInvitato);

