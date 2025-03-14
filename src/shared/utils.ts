import { Balanco, Produto } from './models';
import Papa from 'papaparse';

export function lerCSVDoLocalStorage(): Produto[] {
  const csvData = localStorage.getItem('csvData');
  if (!csvData) {
    console.log('Sem arquivo CSV salvo');
    return [];
  }

  const resultado = Papa.parse(csvData, {
    header: true, // Converte colunas em chaves do objeto
    skipEmptyLines: true, // Remove linhas vazias
    transformHeader: (header, index) => header.toLowerCase(),
  });

  // Mapeando os dados para a interface Produto
  return resultado.data.map((item: any) => ({
    id: Number(item.id),
    nome: item.descricao || item.nome || item.name || item.desc || '',
    quantidade: Number(item.quantidade) || item.qtd || item.estoque || 0,
    unidade: item.unidade || item.und || 'und',
    codigo: item.codigo || item.cod || '',
  }));
}

export function lerBalancosDoLocalStorage(): Balanco[] {
  const balancos = localStorage.getItem('balancos');
  if (!balancos) {
    console.log('Sem Balancos salvos');
    return [];
  }

  const resultado = JSON.parse(balancos);

  // Mapeando os dados para a interface Produto
  return resultado.map((item: any) => ({
    id: Number(item.id),
    nome: item.nome,
    dataCriacao: new Date(item.dataCriacao),
    produtosIds: item.produtosIds,
  }));
}

export function patchProduto(
  codigo: string,
  quantidade: number,
  balancoId: string
) {
  const balancos = lerBalancosDoLocalStorage();
  const balancoIndex = balancos.findIndex(
    (balanco) => balanco.id === Number(balancoId)
  );
  if (balancoIndex === -1) {
    console.warn(`Balanço com o id ${balancoId} não existe`);
    return;
  }
  const balanco = balancos[balancoIndex];
  const produtos = lerCSVDoLocalStorage().filter((produto) =>
    balanco.produtosIds.includes(produto.id.toString())
  );
  let produtoIndex = produtos.findIndex((p) => p.codigo === codigo);

  if (produtoIndex === -1) {
    console.log(
      `Produto com o código ${codigo} não encontrado. Criando um novo`
    );
    balanco.produtosIds.push(codigo);
    produtoIndex = produtos.length - 1;
  }

  // ARRUMAR ISSO!

  // Atualiza a quantidade do produto no balanço
  produtos[produtoIndex].quantidade = quantidade;
  balanco.produtosIds = produtos.map((produto) => produto.id.toString());
  balancos[balancoIndex] = balanco;

  // Salva os balancos atualizados no localStorage
  localStorage.setItem('balancos', JSON.stringify(balancos));

  console.log(`Quantidade do produto ${codigo} atualizada para ${quantidade}`);
}

export function getQtdProduto(codigo: string): number {
  const produtos = lerCSVDoLocalStorage();
  const produto = produtos.find((p) => p.codigo === codigo);

  if (!produto) {
    console.warn(`Produto com código ${codigo} não encontrado.`);
    return 0;
  }

  return produto.quantidade;
}

export function salvarNovoBalanco(nome: string) {
  const balancos = lerBalancosDoLocalStorage();
  const novoBalanco: Balanco = {
    dataCriacao: new Date(),
    id: balancos.length,
    nome: nome,
    produtosIds: [],
  };

  balancos.push(novoBalanco);

  localStorage.setItem('balancos', JSON.stringify(balancos));
}
