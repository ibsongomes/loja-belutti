const dadosPainel = {
    'quem-somos': {
        titulo: 'Quem Somos',
        conteudo: '<p>A Belutti surgiu com o propósito de levar moda masculina com estilo, atitude e personalidade.</p><p>Acreditamos que se vestir bem vai muito além de acompanhar tendências: é uma forma de expressar quem você é.</p>'
    },
    'trocas': {
        titulo: 'Devolução Fácil e Gratuita',
        conteudo: '<p>Caso o produto não esteja inteiramente do seu agrado, você pode devolvê-lo gratuitamente em até 7 dias após o recebimento.</p><p>A devolução ocorre com o estorno no mesmo método de pagamento. A primeira troca é sempre por nossa conta!</p>'
    },
    'prazos': {
        titulo: 'Frete e Prazos',
        conteudo: '<p>O prazo de entrega varia de acordo com a sua região e a modalidade de envio escolhida.</p><h4>Frete Grátis</h4><p>Oferecemos frete grátis para todo o Brasil em compras acima de R$ 399,00.</p>'
    },
    'faq': {
        titulo: 'Dúvidas Frequentes',
        conteudo: '<h4>Como sei meu tamanho?</h4><p>Disponibilizamos uma tabela de medidas detalhada na página de cada produto.</p><h4>Quais as formas de pagamento?</h4><p>Aceitamos PIX e todos os cartões de crédito em até 3x sem juros.</p>'
    }
};

// 2. Selecionar os elementos na página
const botoesAbrir = document.querySelectorAll('.open-sidebar');
const painel = document.getElementById('sidebarPanel');
const fundoEscuro = document.getElementById('sidebarOverlay');
const botaoFechar = document.getElementById('sidebarClose');
const tituloPainel = document.getElementById('sidebarTitle');
const conteudoPainel = document.getElementById('sidebarContent');

// 3. Função para abrir o painel ao clicar num link
botoesAbrir.forEach(botao => {
    botao.addEventListener('click', function(evento) {
        evento.preventDefault(); // Impede o site de saltar para o topo ao clicar no link
        
        // Descobre qual link foi clicado (ex: "trocas")
        const alvo = this.getAttribute('data-target');
        const informacao = dadosPainel[alvo];

        if (informacao) {
            // Injeta o texto correspondente no painel
            tituloPainel.textContent = informacao.titulo;
            conteudoPainel.innerHTML = informacao.conteudo;

            // Mostra o painel e o fundo escuro
            painel.classList.add('active');
            fundoEscuro.classList.add('active');
        }
    });
});

// 4. Função para fechar o painel
function fecharPainel() {
    painel.classList.remove('active');
    fundoEscuro.classList.remove('active');
}

// 5. Fecha o painel se clicar no "X" ou se clicar fora (no fundo escuro)
botaoFechar.addEventListener('click', fecharPainel);
fundoEscuro.addEventListener('click', fecharPainel);