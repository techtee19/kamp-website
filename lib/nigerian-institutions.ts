import institutionsData from '@/public/data/institutions.json'

export interface NigerianInstitution {
  name: string
  type: 'Federal' | 'State' | 'Private'
  state: string
  abbreviation?: string
  institutionType: 'University' | 'Polytechnic' | 'College of Education'
}

// Bundled snapshot compiled from NUC, NBTE, and NCCE institution registers.
export const NIGERIAN_INSTITUTIONS = institutionsData.institutions as NigerianInstitution[]

export const INSTITUTION_NAMES: string[] = institutionsData.institutions
  .map((institution) => institution.name)
  .sort()
