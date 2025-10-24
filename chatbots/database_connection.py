import os
from typing import List, Dict, Any, Optional, Union
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://fknvdbcarwguzshzbise.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY",
                         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrbnZkYmNhcndndXpzaHpiaXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NTgyNjUsImV4cCI6MjA3NTQzNDI2NX0.AsYj3ShPdZ_H6-1L0ZiXTKxJTme0f9T_ZmAc7gcYIqE")
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    raise ConnectionError(f"Supabase连接失败: {e}")


def get_major_details(major_name: str) -> Optional[Dict[str, Any]]:

    # 1. 查找匹配的主修 (使用 v_majors_full 视图进行模糊搜索)
    # 优先搜索英文名称，因为数据收集时英文名称更规范
    response = supabase.table("v_majors_full") \
        .select("*") \
        .ilike("major_name_en", f"%{major_name}%") \
        .limit(1) \
        .execute()

    if not response.data:
        # 尝试搜索中文名称
        response = supabase.table("v_majors_full") \
            .select("*") \
            .ilike("major_name_zh", f"%{major_name}%") \
            .limit(1) \
            .execute()
    if not response.data:
        return None

    major_info = response.data[0]
    major_id = major_info["id"]

    # 2. 获取该主修的所有课程
    courses_response = supabase.table("v_major_courses_detail") \
        .select("*") \
        .eq("major_id", major_id) \
        .order("year_level, is_required", ascending=True) \
        .execute()

    courses = courses_response.data if courses_response.data else []

    # 3. 获取该主修的职业路径
    careers_response = supabase.table("v_major_career_fields_detail") \
        .select("*") \
        .eq("major_id", major_id) \
        .order("relevance_score", ascending=False) \
        .execute()

    careers = careers_response.data if careers_response.data else []

    # 4. 整合结果
    return {
        "type": "major_detail",
        "query": major_name,
        "major_info": major_info,
        "courses": courses,
        "career_paths": careers
    }


def find_majors_by_career_keyword(career_keyword: str) -> List[Dict[str, Any]]:
    """根据职业关键词反向查找相关的主修。"""

    # 使用我们在SQL中创建的存储过程 find_majors_by_career
    # 它会搜索 career_fields 表的名称和描述，以及 major_career_fields 表的 typical_roles 字段
    response = supabase.rpc("find_majors_by_career", {"career_name": career_keyword}).execute()

    return response.data if response.data else []


def find_majors_by_course_keyword(course_keyword: str) -> List[Dict[str, Any]]:
    """
    根据课程代码或名称查找包含该课程的所有主修。

    Args:
        course_keyword: 课程代码或名称关键词 (e.g., "COMP1001", "Algorithms")

    Returns:
        包含该课程的主修列表。
    """
    # 1. 查找匹配的课程
    # 优先搜索课程代码
    courses_response = supabase.table("courses") \
        .select("id") \
        .ilike("course_code", f"%{course_keyword}%") \
        .limit(1) \
        .execute()

    if not courses_response.data:
        # 如果不是课程代码，尝试搜索课程名称
        courses_response = supabase.table("courses") \
            .select("id") \
            .ilike("name_en", f"%{course_keyword}%") \
            .limit(1) \
            .execute()

    if not courses_response.data:
        return []
    course_id = courses_response.data[0]["id"]

    # 2. 查找包含该课程的主修
    majors_response = supabase.table("v_major_courses_detail") \
        .select("major_id") \
        .eq("course_id", course_id) \
        .execute()

    # 3. 获取主修的完整信息 (避免重复，并获取大学信息)
    major_ids = list(set([item["major_id"] for item in majors_response.data]))

    if not major_ids:
        return []

    full_majors_response = supabase.table("v_majors_full") \
        .select("*") \
        .in_("id", major_ids) \
        .execute()

    return full_majors_response.data if full_majors_response.data else []


# ====================================================================
# 智能通用搜索函数
# ====================================================================
def smart_search(keyword: str) -> Dict[str, Any]:
    """
    根据关键词智能判断搜索意图，并返回最相关的信息。

    Args:
        keyword: 用户输入的关键词。

    Returns:
        包含搜索结果和意图判断的字典。
    """
    keyword = keyword.strip()
    if not keyword:
        return {"intent": "error", "query": keyword, "message": "关键词不能为空。"}
    # --- 优先级 1: 专业/主修名称搜索 (精确匹配优先) ---
    # 尝试将关键词视为专业名称进行搜索
    major_details = get_major_details(keyword)
    if major_details:
        print(f"意图判断: 关键词 '{keyword}' 匹配到专业/主修。")
        return {
            "intent": "major_detail",
            "query": keyword,
            "data": major_details
        }
    # --- 优先级 2: 职业反向搜索 (匹配到职业领域/描述) ---
    # 尝试将关键词视为职业兴趣或描述进行反向搜索
    career_majors = find_majors_by_career_keyword(keyword)
    if career_majors:
        print(f"意图判断: 关键词 '{keyword}' 匹配到职业领域/描述。")
        return {
            "intent": "career_search",
            "query": keyword,
            "results": career_majors
        }
    # --- 优先级 3: 课程代码/名称搜索 (匹配到课程) ---
    # 尝试将关键词视为课程代码或名称进行搜索
    course_majors = find_majors_by_course_keyword(keyword)
    if course_majors:
        print(f"意图判断: 关键词 '{keyword}' 匹配到课程。")
        return {
            "intent": "course_search",
            "query": keyword,
            "results": course_majors
        }
    # --- 优先级 4: 全局模糊搜索 (作为最后的尝试) ---
    # 如果以上都不匹配，可以尝试在所有专业名称中进行更宽泛的模糊搜索
    broad_majors_response = supabase.table("v_majors_full") \
        .select("*") \
        .ilike("major_name_en", f"%{keyword}%") \
        .limit(5) \
        .execute()

    if broad_majors_response.data:
        print(f"意图判断: 关键词 '{keyword}' 进行宽泛模糊搜索。")
        return {
            "intent": "broad_search",
            "query": keyword,
            "results": broad_majors_response.data
        }
    # --- 最终结果 ---
    print(f"意图判断: 未找到相关信息。")
    return {"intent": "not_found", "query": keyword, "message": f"抱歉，未找到与 '{keyword}' 相关的专业、课程或职业信息。"}