import { Produto } from './models';
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

export function patchProduto(codigo: string, quantidade: number) {
  const produtos = lerCSVDoLocalStorage();
  const produtoIndex = produtos.findIndex((p) => p.codigo === codigo);

  if (produtoIndex === -1) {
    console.log(`Produto com o código ${codigo} não encontrado`);
    return;
  }

  // Atualiza a quantidade do produto
  produtos[produtoIndex].quantidade = quantidade;

  // Salva os produtos atualizados no localStorage
  localStorage.setItem('csvData', Papa.unparse(produtos));

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
