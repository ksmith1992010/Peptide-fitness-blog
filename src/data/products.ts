export interface Product {
  slug: string;
  name: string;
  price: number;
  blurb: string;
  details: string[];
  sku: string;
}

export const products: Product[] = [
  {
    slug: 'bac-water',
    name: 'Bacteriostatic Water',
    price: 18,
    sku: 'AB-BAC-30',
    blurb: '30 mL bacteriostatic water for reconstitution math and lab bench use.',
    details: [
      '30 mL vial',
      '0.9% benzyl alcohol preservative',
      'For research / educational reconstitution workflows',
      'Not a drug product; not for injection guidance',
    ],
  },
  {
    slug: 'insulin-syringes',
    name: 'U-100 Insulin Syringes',
    price: 22,
    sku: 'AB-SYR-U100',
    blurb: 'Box of 100 × 1 mL U-100 syringes for precise unit draws in research settings.',
    details: [
      '100 count',
      '1 mL / U-100 markings',
      'Individually wrapped',
      'Pairs with the Amino Brief syringe-units tool',
    ],
  },
  {
    slug: 'vial-carry-case',
    name: 'Vial Carry Case',
    price: 34,
    sku: 'AB-CASE-V4',
    blurb: 'Hard-shell travel case with foam inserts for vials and syringes.',
    details: [
      'Holds up to 4 standard vials',
      'Syringe sleeve + ice-pack slot',
      'Latch closure, TSA-friendly hard shell',
      'No peptides included — accessories only',
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
