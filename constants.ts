import { Product, User, Category, Supplier, PurchaseOrder, ActivityLog } from './types';

// --- AUTHENTICATION ---
export const USERS: User[] = [
  { id: 'user-1', username: 'admin', password: 'admin123', role: 'admin' },
  { id: 'user-2', username: 'usuario', password: 'usuario123', role: 'common' },
];

// --- SUPPLIERS & PURCHASE ORDERS ---
export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'sup-1', name: 'Fornecedor Padrão', contactPerson: 'Carlos Silva', email: 'contato@fornecedor.com', phone: '(11) 98765-4321' },
  { id: 'sup-2', name: 'Distribuidora Veloz', contactPerson: 'Ana Costa', email: 'vendas@veloz.com', phone: '(21) 91234-5678' },
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = []; // Start with no orders

// --- PRODUCTS & CATEGORIES (FROM PDF) ---
export const INITIAL_CATEGORIES: Category[] = [
    'UNITÁRIO',
    'PACOTE',
    'CAIXA',
    'KG'
];

const productNames = [
    "AÇÚCAR REFINADO 1KG UNIÃO", "AÇÚCAR SACHÊ", "ADOÇANTE LIQ. 100ML ZERO CAL", "AIR WICK - REFIL DE BOM AR", "ÁLCOOL 70% 5L LÍQUIDO", "ANTIMOFO 1KG",
    "APARELHO AIR WICK - BOM AR", "BALA CAFÉ PCT", "BISCOITO 10 G", "CAFÉ 250GR", "CAFÉ GRÃO", "CAIXA DE FÓSFORO", "CIF SAPONÁCEO CREMOSO 450ML",
    "COLHER DE SOBREMA C/50", "COPO 200ML 100UN TRANSL COPOZAN", "COPO 50/80ML PACOTE", "COPO DE VIDRO 425ML - 14 1/4 OZ - 45,5 CL", "DESIFETANTE PINHO DE 1L",
    "DESINFETANTE CASA PERFUME 1L SENSUALIDADE", "DETERGENTE LIQ 500ML YPE NEUTRO", "ESCOVA DE ROUPA", "ESCOVA DE SANITÁRIO", "ESCOVA PARA RALO DE PIA", "ESPONJA",
    "FILME DE PVC 300M", "FILTRO DE PAPEL 10 C/30UN MELITTA", "FLANELA", "FREECÔ 500 ML", "GARFO PLÁSTICO SOBREMESA PCT. C/50", "GEL ADESIVO ZAPCLEAN REFIL LAVANDA",
    "GUARDANAPO 22X23CM C/50UN COQUETEL", "LUVA NITRÍLICA TAM. M c/100", "MEXEDOR DE CAFÉ PLÁSTICO C/ 500", "NAFTALINA", "MULTIUSO 500ML UAU FLORES E FRESCOR",
    "PANO DE CHÃO", "PANO DE MICROFIBRA", "PANO LIMPEZA C/5UN PERFEX", "PAPEL ALUMÍNIO 65MX45CM", "PAPEL HIGIEN 8x250M F. DUPLA IPEL ELX",
    "PAPEL TOALHA INTER 2000UN 100% IPEL SOFT ELX", "PERFUME AMBIENTE PERSONALIZADO", "PRATO DESCARTÁVEL 15CM BRANCO PCT C/10", "PRATO DE SOBREMESA", "RODO",
    "SABÃO EM BARRA GLICERINADO", "SABÃO EM PÓ 1KG", "SABÃO GELÉIA", "SABONETE LÍQUIDO 5L", "SACO DE LIXO AMARELO 60L C/100", "SACO DE LIXO AZUL 100L C/100",
    "SACO DE LIXO BRANCO 20L", "SACO DE LIXO CINZA 100L C/100", "SACO DE LIXO MARROM 100L C/100", "SACO DE LIXO VERMELHO 100L C/100", "SACO PARA ABSORVENTE REFIL",
    "VASSOURA PÊLO", "VASSOURA PIAÇAVA", "VEJA X-14 1L LP CLORO ATIVO 2 EM 1", "VELA PEQUENA C/20 AZUL", "VELA PEQUENA C/20 ROSA", "XÍCARA DE CAFÉ (JOGO COMPLETO)",
    "XÍCARA DE CHÁ (JOGO COMPLETO)"
];

const productCategories = [
    "UNITÁRIO", "CAIXA", "UNITÁRIO", "UNITÁRIO", "UNITÁRIO", "KG", "UNITÁRIO", "PACOTE", "CAIXA", "UNITÁRIO", "UNITÁRIO", "UNITÁRIO", "UNITÁRIO", "PACOTE",
    "PACOTE", "PACOTE", "UNITÁRIO", "UNITÁRIO", "UNITÁRIO", "UNITÁrio", "UNITÁRIO", "UNITÁRIO", "UNITÁRIO", "UNITÁRIO", "UNITÁRIO", "PACOTE", "UNITÁRIO",
    "UNITÁRIO", "PACOTE", "UNITÁRIO", "PACOTE", "CAIXA", "PACOTE", "PACOTE", "UNITÁRIO", "UNITÁRIO", "UNITÁRIO", "PACOTE", "UNITÁRIO", "UNITÁRIO", "UNITÁRIO",
    "UNITÁRIO", "PACOTE", "UNITÁRIO", "UNITÁRIO", "UNITÁRIO", "UNITÁRIO", "UNITÁRIO", "UNITÁRIO", "PACOTE", "PACOTE", "PACOTE", "PACOTE", "PACOTE", "PACOTE",
    "PACOTE", "UNITÁRIO", "UNITÁRIO", "UNITÁRIO", "PACOTE", "PACOTE", "UNITÁRIO", "UNITÁRIO"
].map(c => c.toUpperCase());

const realisticCostPrices = [
    5.00, 15.00, 8.00, 18.00, 45.00, 12.00, 25.00, 7.00, 20.00, 10.00, 
    40.00, 5.00, 9.00, 4.00, 8.00, 6.00, 12.00, 7.00, 9.00, 3.50, 
    6.00, 10.00, 5.00, 4.00, 20.00, 6.00, 4.00, 30.00, 4.00, 8.00, 
    5.00, 40.00, 15.00, 5.00, 7.00, 5.00, 8.00, 10.00, 35.00, 80.00, 
    50.00, 25.00, 3.00, 20.00, 15.00, 8.00, 12.00, 10.00, 55.00, 40.00, 
    50.00, 20.00, 50.00, 50.00, 50.00, 18.00, 20.00, 15.00, 16.00, 10.00, 
    10.00, 80.00, 100.00
];

// Helper to generate random numbers for mock data
const getRandom = (min: number, max: number, decimals: number = 2) => {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
};

export const INITIAL_PRODUCTS: Product[] = productNames.map((name, index) => {
    const costPrice = realisticCostPrices[index] || getRandom(5, 150); // Fallback to random if price is missing
    const now = new Date();

    return {
        id: `prod-${Date.now() + index}`,
        name: name,
        category: productCategories[index] || 'UNITÁRIO',
        quantity: getRandom(10, 100, 0),
        costPrice: costPrice,
        description: `Descrição para ${name}.`,
        lastUpdated: new Date(now.setDate(now.getDate() - getRandom(1, 30, 0))).toISOString(),
        location: 'Estoque Principal',
        supplierIds: ['sup-1'],
        reorderQuantity: 10,
        priceHistory: [{
            costPrice,
            date: new Date(now.setDate(now.getDate() - 35)).toISOString(),
        }]
    };
});


// --- ACTIVITY LOGS ---
export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [];