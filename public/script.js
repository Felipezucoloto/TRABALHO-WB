// Função de login
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (result.status === 'success') {
        document.getElementById('loginContent').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        fetchData().then(data => populateTable(data));
    } else {
        alert('Usuário ou senha incorretos');
    }
});

// Função para alterar algo na página principal
document.getElementById('changeButton').addEventListener('click', function () {
    const content = document.getElementById('content');
    content.textContent = 'Conteúdo alterado!';
});

// Função para preencher a tabela
function populateTable(data) {
    const tbody = document.getElementById('dataTable').querySelector('tbody');
    tbody.innerHTML = '';
    data.forEach(item => {
        const row = `<tr>
                        <td>${item.id}</td>
                        <td>${item.nome}</td>
                        <td>${item.idade}</td>
                    </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

// Chamada "API" para buscar dados
async function fetchData() {
    const response = await fetch('/data');
    const data = await response.json();
    return data;
}

// Buscar informação na tabela
document.getElementById('searchButton').addEventListener('click', async function () {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const response = await fetch(`/search?query=${searchInput}`);
    const data = await response.json();
    populateTable(data);
});
