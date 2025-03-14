import { Balanco, Produto } from './models';
import Papa from 'papaparse';

export function lerCSVDoLocalStorage(): Produto[] {
  const csvData = localStorage.getItem('csvData');
  if (!csvData) {
    console.log('Sem arquivo CSV salvo');
    return [];
  }

  const resultado = Papa.parse<Produto>(csvData, {
    skipEmptyLines: true,
    header: true, // Garante que o cabeçalho seja reconhecido corretamente
  });

  if (resultado.errors.length > 0) {
    console.error('Erro ao processar CSV:', resultado.errors);
    throw new Error('Formato inválido dos dados importados');
  }

  return resultado.data.map((item, index) => ({
    id: item.id || index.toString(),
    nome: item.nome?.trim(),
    unidade: item.unidade?.trim(),
    codigo: item.codigo.trim(),
  }));
}

export function lerBalancosDoLocalStorage(): Balanco[] {
  try {
    const balancosStr = localStorage.getItem('balancos');
    if (!balancosStr) {
      console.log('Sem Balancos salvos');
      return [];
    }

    const balancos: Balanco[] = JSON.parse(balancosStr);
    return balancos.map((balanco) => ({
      ...balanco,
      dataCriacao: new Date(balanco.dataCriacao),
      produtos: balanco.produtos.map((produto) => ({
        id: produto.id,
        quantidade: Number(produto.quantidade) || 0,
      })),
    }));
  } catch (error) {
    console.error('Erro ao ler balanços:', error);
    return [];
  }
}

export function patchProduto(
  codigo: string,
  quantidade: number,
  balancoId: string
) {
  const balancos = lerBalancosDoLocalStorage();
  const balancoIndex = balancos.findIndex((b) => b.id === Number(balancoId));

  if (balancoIndex === -1) {
    throw new Error(`Balanço com o id ${balancoId} não existe`);
  }

  const produtos = lerCSVDoLocalStorage();
  let produtoIndex = produtos.findIndex((p) => p.codigo === codigo);
  const balanco = balancos[balancoIndex];

  if (produtoIndex === -1) {
    // produto não tinha nos dados
    console.log(
      `Produto com o código ${codigo} não existe. Criando um novo para o balanço...`
    );
    const newProduto = {
      codigo,
      id: crypto.randomUUID(),
    };
    produtos.push(newProduto);
    localStorage.setItem('csvData', Papa.unparse(produtos)); // atualiza os produtos
    balanco.produtos.push({ id: newProduto.id, quantidade });
  } else {
    // produto já pertencia aos dados importados
    const produto = produtos[produtoIndex];
    const balancoProdutoIndex = balanco.produtos.findIndex(
      (p) => p.id === produto.id
    );
    if (balancoProdutoIndex === -1) {
      // Não existe esse produto para esse balanço ainda
      balanco.produtos.push({ id: produto.id, quantidade });
    } else {
      balanco.produtos[balancoProdutoIndex].quantidade = quantidade;
    }
  }
  balancos[balancoIndex] = balanco;

  localStorage.setItem('balancos', JSON.stringify(balancos));
  console.log(`Quantidade do produto ${codigo} atualizada para ${quantidade}`);
}

export function getQtdProduto(codigo: string, balancoId: string): number {
  const produtos = lerCSVDoLocalStorage();
  const produto = produtos.find((p) => p.codigo === codigo);

  if (!produto) {
    console.warn(`Produto com código ${codigo} não encontrado.`);
    return 0;
  }

  const balanco = lerBalancosDoLocalStorage().find(
    (b) => b.id === Number(balancoId)
  );
  if (!balanco) {
    console.warn(`Balanço com o id ${balancoId} não encontrado.`);
    return 0;
  }

  return balanco.produtos.find((p) => p.id === produto.id)?.quantidade || 0;
}

export function salvarNovoBalanco(nome: string) {
  const produtos = lerCSVDoLocalStorage();
  const balancos = lerBalancosDoLocalStorage();

  const novoBalanco: Balanco = {
    id: balancos.length,
    nome: nome.trim() || 'Novo Balanço',
    dataCriacao: new Date(),
    produtos: produtos.map((produto) => ({ id: produto.id, quantidade: 0 })),
  };

  balancos.push(novoBalanco);
  localStorage.setItem('balancos', JSON.stringify(balancos));
  console.log(`Novo balanço '${nome}' salvo com sucesso.`);
}
