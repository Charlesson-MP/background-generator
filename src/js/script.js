// Passos:
// 1. No JavaScript, pegar o evento de submit do formulário para evitar o recarregamento da página.
// 2. Obter o valor digitado pelo usuário no campo de texto.
// 3. Exibir um indicador de carregamento enquanto a requisição está sendo processada.
// 4. Fazer uma requisição HTTP (POST) para a API do n8n, enviando o texto do formulário no corpo da requisição em formato JSON.
// 5. Receber a resposta da API do n8n (esperando um JSON com o código HTML/CSS do background).
// 6. Se a resposta for válida, exibir o código HTML/CSS retornado na tela:
//    - Mostrar o HTML gerado em uma área de preview.
//    - Inserir o CSS retornado dinamicamente na página para aplicar o background.
// 7. Remover o indicador de carregamento após o recebimento da resposta.

function setLoading(isLoading) {
    const btnSpan = document.querySelector('.btn-generate');

    if(isLoading) {
        btnSpan.textContent = 'Gerando background...';
    }else {
        btnSpan.textContent = 'Gerar background';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // 1. No JavaScript, pegar o evento de submit do formulário para evitar o recarregamento da página.
    const form = document.querySelector('.form-group');
    const txtArea = document.getElementById('description');
    const htmlCode = document.getElementById('html-code');
    const cssCode = document.getElementById('css-code');
    const preview = document.getElementById('preview-section');
    form.addEventListener('submit', async function(evt) {
        evt.preventDefault();
        
        // 2. Obter o valor digitado pelo usuário no campo de texto.
        const description = txtArea.value.trim();

        if(!description) {
            return;
        }

        // 3. Exibir um indicador de carregamento enquanto a requisição está sendo processada.
        setLoading(true);

        // 4. Fazer uma requisição HTTP (POST) para a API do n8n, enviando o texto do formulário no corpo da requisição em formato JSON.
        try {
            const response = await fetch('https://skarfate.app.n8n.cloud/webhook/background-generator', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({description})
            });

            const data = await response.json();
            htmlCode.textContent = data.code || '';
            cssCode.textContent = data.style || '';

            preview.style.display = 'block';
            preview.innerHTML = data.code || '';

            let styleTag = document.getElementById('dynamic-style');
            if(styleTag) styleTag.remove();

            if(data.style) {
                styleTag = document.createElement('style');
                styleTag.id = 'dynamic-style';

                styleTag.textContent = data.style;
                document.head.appendChild(styleTag);
            }
            
        }catch(error) {
            console.error('Erro ao gerar background:', error);
            htmlCode.textContent = "Não foi possível gerar o código html, tente novamente."
            cssCode.textContent = "Não foi possível gerar o código css, tente novamente."
            preview.innerHTML = '';
        }finally {
            setLoading(false);
            txtArea.value = '';
        }
    })
});