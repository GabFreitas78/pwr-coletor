export interface Produto {
  id: string;
  nome: string;
  unidade: string;
  codigo: string;
}

export interface Balanco {
  id: number;
  nome: string;
  dataCriacao: Date;
  produtos: {
    id: string;
    quantidade: number;
  }[];
}
