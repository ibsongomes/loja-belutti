document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. OFFCANVAS (PAINEL INSTITUCIONAL LATERAL)
    ========================================= */
    const openSidebarBtns = document.querySelectorAll('.open-sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarPanel = document.getElementById('sidebarPanel');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarTitle = document.getElementById('sidebarTitle');
    const sidebarContent = document.getElementById('sidebarContent');

    const dadosPainel = {
        'quem-somos': {
            titulo: 'Quem Somos',
            conteudo: '<p>A Belutti surgiu com o propósito de levar moda masculina com estilo, atitude e personalidade. Reunimos peças que combinam conforto e versatilidade para acompanhar você em diferentes momentos.</p>'
        },
        'trocas': {
            titulo: 'Políticas de Troca e Devolução',
            conteudo: '<p>Caso o produto não sirva ou não goste, você tem até 7 dias após o recebimento para solicitar a troca ou devolução gratuita.</p>'
        },
        'prazos': {
            titulo: 'Prazos de Entrega',
            conteudo: '<p>Os nossos prazos variam de acordo com a sua região e a modalidade de frete escolhida no momento da compra.</p>'
        },
        'faq': {
            titulo: 'Perguntas Frequentes (FAQ)',
            conteudo: '<p><strong>Como rastreio o meu pedido?</strong><br>Você receberá um código de rastreio no seu e-mail assim que o pedido for despachado.</p>'
        },
        'privacidade': {
            titulo: 'Política de Privacidade',
            conteudo: '<p>A Belutti valoriza a sua privacidade e garante o sigilo total das informações que nos fornece.</p><p>Os seus dados pessoais são armazenados em ambiente seguro e utilizados exclusivamente para processar as suas compras.</p>'
        },
        'termos': {
            titulo: 'Termos de Uso',
            conteudo: '<p>Ao acessar e realizar compras na loja Belutti, você concorda com os nossos Termos de Uso.</p><p>Todo o conteúdo deste site é de propriedade exclusiva da Belutti.</p>'
        }
    };

    if (sidebarPanel && sidebarOverlay) {
        openSidebarBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const target = btn.getAttribute('data-target');
                if(dadosPainel[target]) {
                    sidebarTitle.textContent = dadosPainel[target].titulo;
                    sidebarContent.innerHTML = dadosPainel[target].conteudo;
                    sidebarOverlay.classList.add('active');
                    sidebarPanel.classList.add('active');
                }
            });
        });

        const fecharPainel = () => {
            sidebarOverlay.classList.remove('active');
            sidebarPanel.classList.remove('active');
        };

        if(sidebarClose) sidebarClose.addEventListener('click', fecharPainel);
        sidebarOverlay.addEventListener('click', fecharPainel);
    }


    /* =========================================
       2. SISTEMA DE FILTROS (CORES E PREÇO)
    ========================================= */
    const sliderMin = document.getElementById('slider-min');
    const sliderMax = document.getElementById('slider-max');
    const displayMin = document.getElementById('price-min-val');
    const displayMax = document.getElementById('price-max-val');
    const track = document.querySelector('.slider-track');
    
    const colorItems = document.querySelectorAll('.color-item');
    const produtos = document.querySelectorAll('.product-card');
    const resultCount = document.getElementById('resultado-count');

    let corAtiva = null; 

    function atualizarSlider() {
        if(!sliderMin || !sliderMax) return; // Proteção se a página não tiver filtros
        
        let minVal = parseInt(sliderMin.value);
        let maxVal = parseInt(sliderMax.value);
        const maxLimit = parseInt(sliderMax.max);

        // Impede que as bolinhas do preço se cruzem
        if (maxVal - minVal < 10) {
            if (this.id === 'slider-min') sliderMin.value = maxVal - 10;
            else sliderMax.value = minVal + 10;
            minVal = parseInt(sliderMin.value);
            maxVal = parseInt(sliderMax.value);
        }

        displayMin.textContent = `R$ ${minVal}`;
        displayMax.textContent = `R$ ${maxVal}`;

        const percentMin = (minVal / maxLimit) * 100;
        const percentMax = (maxVal / maxLimit) * 100;
        if(track) {
            track.style.left = percentMin + "%";
            track.style.right = (100 - percentMax) + "%";
        }

        filtrarProdutos(); 
    }

    if(sliderMin && sliderMax) {
        sliderMin.addEventListener('input', atualizarSlider);
        sliderMax.addEventListener('input', atualizarSlider);
        atualizarSlider(); 
    }

    colorItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                corAtiva = null;
            } else {
                colorItems.forEach(c => c.classList.remove('active'));
                item.classList.add('active');
                corAtiva = item.getAttribute('data-cor');
            }
            filtrarProdutos();
        });
    });

    function filtrarProdutos() {
        if(!sliderMin || !sliderMax) return;
        
        const precoMin = parseInt(sliderMin.value);
        const precoMax = parseInt(sliderMax.value);
        let visiveis = 0;

        produtos.forEach(produto => {
            const precoProduto = parseFloat(produto.getAttribute('data-preco'));
            const corProduto = produto.getAttribute('data-cor');

            const passaPreco = precoProduto >= precoMin && precoProduto <= precoMax;
            const passaCor = corAtiva === null || corAtiva === corProduto;

            if (passaPreco && passaCor) {
                produto.style.display = 'flex';
                visiveis++;
            } else {
                produto.style.display = 'none';
            }
        });

        if(resultCount) {
            resultCount.textContent = `Exibindo: ${visiveis} resultado${visiveis !== 1 ? 's' : ''}`;
        }
    }


    /* =========================================
       3. RECOLHER/EXPANDIR FILTROS (SETINHAS)
    ========================================= */
    const filterToggles = document.querySelectorAll('.filter-toggle');
    filterToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const group = toggle.closest('.filter-group');
            if(group) group.classList.toggle('collapsed');
        });
    });


    /* =========================================
       4. ORDENAÇÃO DE PRODUTOS (MENOR/MAIOR PREÇO)
    ========================================= */
    const sortSelect = document.getElementById('ordenar-produtos');
    const gridProdutos = document.getElementById('productGrid');
    
    if(sortSelect && gridProdutos) {
        // Pega todos os produtos que estão na grid
        const listaProdutos = Array.from(document.querySelectorAll('.product-grid .product-card'));
        const ordemOriginal = [...listaProdutos]; // Salva a ordem padrão

        sortSelect.addEventListener('change', () => {
            const valor = sortSelect.value;
            let produtosReordenados = [...listaProdutos];

            if (valor === 'menor') {
                produtosReordenados.sort((a, b) => parseFloat(a.getAttribute('data-preco')) - parseFloat(b.getAttribute('data-preco')));
            } else if (valor === 'maior') {
                produtosReordenados.sort((a, b) => parseFloat(b.getAttribute('data-preco')) - parseFloat(a.getAttribute('data-preco')));
            } else {
                produtosReordenados = [...ordemOriginal]; 
            }

            // Remove todos os produtos e os readiciona na ordem correta
            gridProdutos.innerHTML = '';
            produtosReordenados.forEach(produto => {
                gridProdutos.appendChild(produto); 
            });
        });
    }

});