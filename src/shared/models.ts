export interface Produto {
  id: number;
  nome: string;
  quantidade: number;
  unidade: string;
  codigo: string;
}

export interface Balanco {
  id: number;
  nome: string;
  dataCriacao: Date;
  produtosIds: string[];
}
