export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  credentials?: string;
  reviewsMedicalClaims: boolean;
}

export const authors: Author[] = [
  {
    id: 'editorial',
    name: 'Amino Brief Editorial',
    role: 'Publisher',
    bio: 'Independent education brand writing peptide literacy with evidence grades, sources, and hard disclaimers. We are not a clinic or pharmacy.',
    credentials: 'Editorial standards published at /editorial',
    reviewsMedicalClaims: false,
  },
  {
    id: 'reviewer-slot',
    name: 'External clinical reviewer',
    role: 'Medical review (not yet seated)',
    bio: 'Reserved seat for a licensed clinician who can review YMYL-adjacent pieces when we commission formal medical review. Until filled, treat all content as educational literacy only — not clinician-reviewed care guidance.',
    credentials: 'TBD — disclosed here when engaged',
    reviewsMedicalClaims: false,
  },
];
