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
    delimiter: ',',
    // transformHeader: (header, index) => header.toLowerCase(),
  });

  let id = 0;
  // Mapeando os dados para a interface Produto
  return resultado.data.map((item: any) => ({
    id: `${id++}`,
    nome: item.descricao || item.nome || item.name || item.desc || '',
    unidade: item.unidade || item.und || 'und',
    codigo: item.codigo || item.cod || '',
  }));
}

export function lerBalancosDoLocalStorage(): Balanco[] {
  const balancosStr = localStorage.getItem('balancos');
  if (!balancosStr) {
    console.log('Sem Balancos salvos');
    return [];
  }

  const balancos = JSON.parse(balancosStr);

  // Mapeando os dados para a interface Produto
  return balancos.map((item: any) => ({
    id: Number(item.id),
    nome: item.nome,
    dataCriacao: new Date(item.dataCriacao),
    produtos: item.produtos.map((item: any) => ({
      id: item.id,
      quantidade: Number(item.quantidade),
    })),
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
    throw Error(`Balanço com o id ${balancoId} não existe`);
  }

  const balanco = balancos[balancoIndex];

  const produto = lerCSVDoLocalStorage().find(
    (produto) => produto.codigo === codigo
  );

  if (!produto) {
    throw Error(`Produto com o código ${codigo} não existe`);
  }

  let balancoProduto = balanco.produtos.find((p) => p.id === produto.id);

  if (balancoProduto === undefined) {
    // balanco não possui o produto ainda, mas o produto existe
    console.log(
      `O balanco de id ${balancoId} ainda não possui o produto de id ${produto.id}. Criando novo...`
    );

    balancoProduto = {
      id: produto.id,
      quantidade,
    };
  } else {
    balancoProduto.quantidade = quantidade;
  }

  balanco.produtos.push(balancoProduto);
  balancos[balancoIndex] = balanco;

  // Salva os balancos atualizados no localStorage
  localStorage.setItem('balancos', JSON.stringify(balancos));

  console.log(`Quantidade do produto ${codigo} atualizada para ${quantidade}`);
}

export function getQtdProduto(codigo: string, balancoId: string): number {
  const produtos = lerCSVDoLocalStorage();
  const produtoId = produtos.find((p) => p.codigo === codigo)?.id;

  if (!produtoId) {
    console.warn(`Produto com código ${codigo} não encontrado.`);
    return 0;
  }
  const balanco = lerBalancosDoLocalStorage().find(
    (balanco) => balanco.id === Number(balancoId)
  );

  if (!balanco) {
    console.warn(`Balanco com o id ${balancoId} não encontrado.`);
    return 0;
  }

  const produto = balanco.produtos.find((produto) => produto.id === produtoId);

  if (!produto) {
    console.warn(
      `O produto de código ${codigo} não pertence ao balanco de id ${balancoId}`
    );
    return 0;
  }

  return produto.quantidade;
}

export function salvarNovoBalanco(nome: string) {
  const produtos = lerCSVDoLocalStorage();
  const balancos = lerBalancosDoLocalStorage();
  const novoBalanco: Balanco = {
    dataCriacao: new Date(),
    id: balancos.length,
    nome: nome,
    produtos: produtos.map((produto) => ({ id: produto.id, quantidade: 0 })),
  };
  balancos.push(novoBalanco);

  localStorage.setItem('balancos', JSON.stringify(balancos));
}
