# app/supa.py
from supabase import create_client, Client
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # 後端用 service role key（勿曝露在前端）
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def insert_majors(majors):
    rows = [m.dict() for m in majors]
    return supabase.table("majors").insert(rows).execute()

def search_majors(text: str):
    """
    Search majors by faculty exact match (preferred) or fallback to fuzzy major_name match.

    This implements the requested behavior: return rows where the column `faculty`
    equals the provided text. Some databases/tables may have the column misspelled
    as `faulculty`; we attempt both names to be forgiving.
    """
    # 1) Try exact match on 'faculty'
    try:
        resp = supabase.table("majors").select("*").eq("faculty", text).execute()
        if resp and getattr(resp, 'data', None):
            return resp
    except Exception:
        # ignore and try fallback
        pass

    # 2) Try exact match on the misspelled 'faulculty' column (if present)
    try:
        resp2 = supabase.table("majors").select("*").eq("faulculty", text).execute()
        if resp2 and getattr(resp2, 'data', None):
            return resp2
    except Exception:
        pass

    # 3) Fallback: fuzzy search on major_name (legacy behavior)
    return supabase.table("majors").select("*").ilike("major_name", f"%{text}%").execute()
