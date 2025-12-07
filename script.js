//Constantes
const SUPABASEURL = "https://wrruusxsjylgmweaujzz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndycnV1c3hzanlsZ213ZWF1anp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MDQ3MTcsImV4cCI6MjA4MDE4MDcxN30.8io1N5jUdKGURGJLxK1rmdu6YgzT83rd8-R_-76Aj98";
const CONEXAOSUPABASE = window.supabase.createClient(SUPABASEURL, SUPABASE_ANON_KEY);

//função que carrega os produtos e chama a função que monta
async function carregarProdutosDia() {
    let { data: produtos_dia, error } = await CONEXAOSUPABASE
        .from('vw_produtos_dia')
        .select('*')

    if(error){
        console.error('Erro ao buscar produtos do dia: ', error)
        return;
    }
    
    montarCardapio(produtos_dia, "produtos_container_dia");

}

//função que carrega os produtos e chama a função que monta
async function carregarProdutos() {
    carregarProdutosDia()
    
    let { data: produtos, error } = await CONEXAOSUPABASE
    .from('vw_produtos')
    .select('*')
    
    if(error){
        console.error('Erro ao buscar produtos: ', error)
        return;
    }

    montarCardapio(produtos, "produtos_container");
}

//função que pega a lista de produtos e os posiciona na seção da div que é passada como parametro
function montarCardapio(produtos, conteiners){
    const conteiner = document.getElementById(conteiners);
    conteiner.innerHTML = "";
    produtos.forEach(produto => {

        const PRECO = Number(produto.valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
        
        const CARDHTML = 
        `
                <article>
                    <img src="${produto.img}" alt="${produto.nome}">
                    <h3>${produto.nome}</h3>
                    <p><strong>${PRECO}</strong></p>
                </article>
        `;
        conteiner.innerHTML += CARDHTML;
    });
}

//função que filtra o cardápio de acordo com o tipo de comida informado
async function filtroCardapio(tipo){
    
    let { data: produtos, error } = await CONEXAOSUPABASE
        .from('produtos')
        .select('*')
        .eq('tipo', tipo)

    if(error){
        console.error('Erro ao buscar produtos: ', error)
        return;
    }
    tirarVisibiladadeDisplay();
    montarCardapio(produtos, "produtos_container");    
}

//função que tira o filtro
function removerFiltro(){
    ativarVisibiladadeDisplay();
    carregarProdutosDia();
    carregarProdutos();
}

//função que tira a visibilidade do display
function tirarVisibiladadeDisplay(){
    produtos_dia.style.display = 'none'
}
//função que seta a visibilidade do display
function ativarVisibiladadeDisplay(){
    produtos_dia.style.display = 'block'
}

carregarProdutos();

//botões 
document.querySelectorAll(".btn_comidas").forEach(button => {
    button.addEventListener("click", () => filtroCardapio(1))
});

document.querySelectorAll(".btn_bebidas").forEach(button => {
    button.addEventListener("click", () => filtroCardapio(2))
});

document.querySelectorAll(".btn_petiscos").forEach(button => {
    button.addEventListener("click", () => filtroCardapio(3))
});

document.querySelectorAll(".btn_remov_filtro").forEach(button => {
    button.addEventListener("click", () => removerFiltro())
});
