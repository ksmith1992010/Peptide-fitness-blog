export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  credentials?: string;
  /** True only when a licensed clinician is seated and disclosed */
  reviewsMedicalClaims: boolean;
  /** open | seated | paused */
  seatStatus: 'open' | 'seated' | 'n/a';
  contactEmail?: string;
}

export const authors: Author[] = [
  {
    id: 'editorial',
    name: 'Amino Brief Editorial',
    role: 'Publisher',
    bio: 'Independent education brand writing peptide literacy with evidence grades, sources, and hard disclaimers. We are not a clinic or pharmacy.',
    credentials: 'Editorial standards published at /editorial',
    reviewsMedicalClaims: false,
    seatStatus: 'n/a',
    contactEmail: 'editorial@aminobrief.com',
  },
  {
    id: 'reviewer-slot',
    name: 'External clinical reviewer',
    role: 'Medical review seat (open)',
    bio: 'Open seat for a licensed clinician (MD / DO / NP / PA / PharmD with relevant scope) to review selected YMYL-adjacent guides before we mark them clinician-reviewed. Until seated, treat all content as educational literacy only — not clinician-reviewed care guidance.',
    credentials:
      'Apply with license jurisdiction + scope: clinical-review@aminobrief.com (alias of editorial until seated). Compensation and conflict policy disclosed on engagement.',
    reviewsMedicalClaims: false,
    seatStatus: 'open',
    contactEmail: 'editorial@aminobrief.com',
  },
];

export function getAuthor(id: string): Author | undefined {
  return authors.find((a) => a.id === id);
}

export function seatedClinicalReviewer(): Author | undefined {
  return authors.find((a) => a.seatStatus === 'seated' && a.reviewsMedicalClaims);
}
