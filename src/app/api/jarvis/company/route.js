import { requireAuth } from '@/lib/api-guard';
import {
  searchCompany,
  getCompanyProfile,
  getCompanyOfficers,
  getPersonsWithSignificantControl,
  getFilingHistory,
} from '@/lib/jarvis/companies-house';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req) {
  const authError = await requireAuth();
  if (authError) return authError;

  let query;
  try {
    ({ query } = await req.json());
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!query?.trim()) {
    return Response.json({ error: 'query is required' }, { status: 400 });
  }

  const match = await searchCompany(query.trim());
  if (!match) {
    return Response.json({ found: false });
  }

  const companyNumber = match.company_number;

  const [profile, officers, pscs, filings] = await Promise.all([
    getCompanyProfile(companyNumber),
    getCompanyOfficers(companyNumber),
    getPersonsWithSignificantControl(companyNumber),
    getFilingHistory(companyNumber, 3),
  ]);

  return Response.json({
    found: true,
    companyNumber,
    name: profile?.company_name ?? match.title ?? null,
    status: profile?.company_status ?? match.company_status ?? null,
    incorporationDate: profile?.date_of_creation ?? null,
    type: profile?.type ?? null,
    address: profile?.registered_office_address ?? null,
    sicCodes: profile?.sic_codes ?? [],
    officers: officers.map(({ name, officer_role, appointed_on, resigned_on }) => ({
      name,
      role: officer_role,
      appointedOn: appointed_on ?? null,
      resignedOn: resigned_on ?? null,
    })),
    pscs: pscs.map(({ name, natures_of_control, notified_on, ceased_on }) => ({
      name,
      naturesOfControl: natures_of_control ?? [],
      notifiedOn: notified_on ?? null,
      ceasedOn: ceased_on ?? null,
    })),
    filings: filings.map(({ description, date, type: filingType }) => ({
      description: description ?? filingType ?? null,
      date: date ?? null,
    })),
  });
}
