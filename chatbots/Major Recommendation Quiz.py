import json

# === Hong Kong University Major Recommendation Quiz  ===
json_data = """
{
  "title": "Hong Kong University Major Recommendation Quiz (Extended Version)",
  "version": "2.0",
  "language": "bilingual",
  "description": "An extended bilingual quiz that assesses students’ interests, abilities, salary expectations, motivation, personality, and career goals to recommend suitable undergraduate majors in Hong Kong's top 8 universities.",
  "dimensions": [
    { "code": "INT", "name_en": "Interest Orientation", "name_zh": "兴趣取向" },
    { "code": "ABI", "name_en": "Abilities and Talents", "name_zh": "能力与天赋" },
    { "code": "SAL", "name_en": "Salary Expectation", "name_zh": "期望薪资" },
    { "code": "JOB", "name_en": "Career Goals", "name_zh": "就业目标" },
    { "code": "PER", "name_en": "Personality Traits", "name_zh": "性格取向（MBTI）" },
    { "code": "MOT", "name_en": "Learning Motivation", "name_zh": "学习动机" }
  ],
  "questions": [
 {
      "id": 1,
      "dimension": "INT",
      "text_en": "What do you most enjoy doing in your free time?",
      "text_zh": "你在空闲时间最喜欢做什么？",
      "options": [
        { "text_en": "Reading tech articles or coding experiments", "text_zh": "阅读科技文章或尝试编程", "score": { "SCIENCE": 2 } },
        { "text_en": "Creating art, music, or design projects", "text_zh": "创作艺术、音乐或设计作品", "score": { "ARTS": 2 } },
        { "text_en": "Organizing events or leading teams", "text_zh": "策划活动或带领团队", "score": { "BUSINESS": 2 } },
        { "text_en": "Volunteering or mentoring others", "text_zh": "参与志愿活动或辅导他人", "score": { "SOCIAL": 2 } }
      ]
    },
    {
      "id": 2,
      "dimension": "ABI",
      "text_en": "Which of the following best describes your natural strengths?",
      "text_zh": "以下哪一项最符合你的天赋？",
      "options": [
        { "text_en": "Logical reasoning and scientific analysis", "text_zh": "逻辑推理与科学分析", "score": { "SCIENCE": 2 } },
        { "text_en": "Leadership and communication", "text_zh": "领导能力与沟通表达", "score": { "BUSINESS": 2 } },
        { "text_en": "Creativity and artistic expression", "text_zh": "创意思维与艺术表现", "score": { "ARTS": 2 } },
        { "text_en": "Empathy and understanding of others", "text_zh": "同理心与理解他人", "score": { "SOCIAL": 2 } }
      ]
    },
    {
      "id": 3,
      "dimension": "INT",
      "text_en": "If you could choose a university project, you would prefer:",
      "text_zh": "如果可以选择一个大学项目，你会更喜欢：",
      "options": [
        { "text_en": "AI, engineering, or technology innovation", "text_zh": "人工智能、工程或科技创新类", "score": { "ENGINEERING": 2 } },
        { "text_en": "Arts, media, or design", "text_zh": "艺术、媒体或设计类", "score": { "ARTS": 2 } },
        { "text_en": "Finance, marketing, or economics", "text_zh": "金融、市场或经济类", "score": { "BUSINESS": 2 } },
        { "text_en": "Education, psychology, or social sciences", "text_zh": "教育、心理或社会科学类", "score": { "SOCIAL": 2 } }
      ]
    },
    {
      "id": 4,
      "dimension": "ABI",
      "text_en": "In a team, you are usually responsible for:",
      "text_zh": "在团队中，你通常负责：",
      "options": [
        { "text_en": "Technical execution or data analysis", "text_zh": "技术实现或数据分析", "score": { "SCIENCE": 2 } },
        { "text_en": "Leadership and coordination", "text_zh": "领导与协调工作", "score": { "BUSINESS": 2 } },
        { "text_en": "Design and creative concepts", "text_zh": "视觉设计与创意构想", "score": { "ARTS": 2 } },
        { "text_en": "Communication and emotional support", "text_zh": "沟通协调与情绪支持", "score": { "SOCIAL": 2 } }
      ]
    },
    {
      "id": 5,
      "dimension": "SAL",
      "text_en": "Your ideal starting salary would be:",
      "text_zh": "你理想的起薪是：",
      "options": [
        { "text_en": "Below HKD 300,000 (passion over pay)", "text_zh": "低于30万港币（兴趣优先）", "score": { "ARTS": 1 } },
        { "text_en": "HKD 300,000–500,000 (stable growth)", "text_zh": "30–50万港币（稳定发展）", "score": { "SOCIAL": 1 } },
        { "text_en": "HKD 500,000–800,000 (high challenge and reward)", "text_zh": "50–80万港币（挑战与回报并存）", "score": { "BUSINESS": 1 } },
        { "text_en": "Above HKD 800,000 (technical or finance elite)", "text_zh": "80万港币以上（技术或金融精英）", "score": { "ENGINEERING": 1 } }
      ]
    },
    {
      "id": 6,
      "dimension": "JOB",
      "text_en": "Which field would you like to work in the future?",
      "text_zh": "你希望未来从事的职业领域是？",
      "options": [
        { "text_en": "Research, engineering, or tech companies", "text_zh": "科研、工程或科技企业", "score": { "ENGINEERING": 2 } },
        { "text_en": "Media, creative, or cultural industries", "text_zh": "媒体、创意或文化产业", "score": { "ARTS": 2 } },
        { "text_en": "Business, finance, or consulting", "text_zh": "商业、金融或咨询", "score": { "BUSINESS": 2 } },
        { "text_en": "Education, psychology, or social service", "text_zh": "教育、心理或社会服务", "score": { "SOCIAL": 2 } }
      ]
    },
    {
      "id": 7,
      "dimension": "INT",
      "text_en": "What kind of work environment do you prefer?",
      "text_zh": "你更喜欢哪种工作环境？",
      "options": [
        { "text_en": "Laboratory or R&D center", "text_zh": "实验室或研发部门", "score": { "SCIENCE": 2 } },
        { "text_en": "Creative studio or workspace", "text_zh": "创意空间或工作室", "score": { "ARTS": 2 } },
        { "text_en": "Office or corporate setting", "text_zh": "写字楼或会议室", "score": { "BUSINESS": 2 } },
        { "text_en": "School or community environment", "text_zh": "学校或社区中心", "score": { "SOCIAL": 2 } }
      ]
    },
    {
      "id": 8,
      "dimension": "ABI",
      "text_en": "When do you feel most accomplished?",
      "text_zh": "什么情况下你最有成就感？",
      "options": [
        { "text_en": "Solving complex problems or successful coding", "text_zh": "解决复杂问题或完成程序编写", "score": { "ENGINEERING": 2 } },
        { "text_en": "Helping others or making a difference", "text_zh": "帮助他人、带来积极改变", "score": { "SOCIAL": 2 } },
        { "text_en": "Leading a team to success", "text_zh": "带领团队成功达成目标", "score": { "BUSINESS": 2 } },
        { "text_en": "Receiving recognition for creative work", "text_zh": "作品获得他人认可", "score": { "ARTS": 2 } }
      ]
    },
    {
      "id": 9,
      "dimension": "SAL",
      "text_en": "How would you respond to a high-paying but stressful job?",
      "text_zh": "面对高薪但压力大的工作，你会怎么做？",
      "options": [
        { "text_en": "Accept it as a challenge", "text_zh": "果断接受，挑战自我", "score": { "BUSINESS": 1 } },
        { "text_en": "Seek a balance between pay and peace", "text_zh": "权衡平衡，不盲目追求高薪", "score": { "SOCIAL": 1 } },
        { "text_en": "Value creative freedom and self-expression", "text_zh": "重视创意自由与自我实现", "score": { "ARTS": 1 } },
        { "text_en": "Choose opportunities that promote learning", "text_zh": "选择能持续学习成长的岗位", "score": { "ENGINEERING": 1 } }
      ]
    },
    {
      "id": 10,
      "dimension": "JOB",
      "text_en": "If you were studying at one of Hong Kong’s top 8 universities, which faculty excites you the most?",
      "text_zh": "如果你在香港八大读书，你最期待哪个学院？",
      "options": [
        { "text_en": "Engineering (HKU, HKUST, PolyU)", "text_zh": "工程学院（港大、科大、理大）", "score": { "ENGINEERING": 3 } },
        { "text_en": "Business (HKU, HKUST, CityU)", "text_zh": "商学院（港大、科大、城大）", "score": { "BUSINESS": 3 } },
        { "text_en": "Arts and Humanities (HKBU, LU, HKU)", "text_zh": "人文与艺术学院（浸大、岭大、港大）", "score": { "ARTS": 3 } },
        { "text_en": "Education and Social Sciences (EdUHK, CUHK, CityU)", "text_zh": "教育与社会科学学院（教大、中大、城大）", "score": { "SOCIAL": 3 } }
      ]
    },
     {
      "id": 11,
      "dimension": "PER",
      "text_en": "When faced with new people or situations, you tend to:",
      "text_zh": "当面对新环境或新朋友时，你通常会：",
      "options": [
        { "text_en": "Actively start conversations", "text_zh": "主动交谈", "score": { "BUSINESS": 2 } },
        { "text_en": "Observe quietly before engaging", "text_zh": "先观察再参与", "score": { "SCIENCE": 2 } },
        { "text_en": "Focus on practical actions", "text_zh": "注重实际行动", "score": { "ENGINEERING": 2 } },
        { "text_en": "Consider feelings and harmony", "text_zh": "注重情感与和谐", "score": { "SOCIAL": 2 } }
      ]
    },
    {
      "id": 12,
      "dimension": "PER",
      "text_en": "Which best describes your decision-making style?",
      "text_zh": "以下哪种最符合你的决策风格？",
      "options": [
        { "text_en": "Careful, structured, and well-planned", "text_zh": "谨慎、计划性强", "score": { "ENGINEERING": 2 } },
        { "text_en": "Flexible and adaptive", "text_zh": "灵活、随机应变", "score": { "ARTS": 2 } },
        { "text_en": "Analytical and logical", "text_zh": "理性分析型", "score": { "SCIENCE": 2 } },
        { "text_en": "Empathetic and people-oriented", "text_zh": "感性、重视人际关系", "score": { "SOCIAL": 2 } }
      ]
    },
    {
      "id": 13,
      "dimension": "MOT",
      "text_en": "What motivates you most to study?",
      "text_zh": "是什么最能激励你学习？",
      "options": [
        { "text_en": "Curiosity and love of knowledge", "text_zh": "好奇心与对知识的热爱", "score": { "SCIENCE": 2 } },
        { "text_en": "Future career opportunities", "text_zh": "未来的职业机会", "score": { "BUSINESS": 2 } },
        { "text_en": "Competition and performance", "text_zh": "竞争与表现欲", "score": { "ENGINEERING": 2 } },
        { "text_en": "Social recognition or family expectations", "text_zh": "社会认同或家庭期望", "score": { "SOCIAL": 2 } }
      ]
    },
    {
      "id": 14,
      "dimension": "MOT",
      "text_en": "When facing academic challenges, you usually:",
      "text_zh": "当遇到学习困难时，你通常会：",
      "options": [
        { "text_en": "Persist and solve problems independently", "text_zh": "坚持下去并独立解决", "score": { "ENGINEERING": 2 } },
        { "text_en": "Seek help from teachers or peers", "text_zh": "寻求老师或同学帮助", "score": { "SOCIAL": 2 } },
        { "text_en": "Feel frustrated and lose motivation", "text_zh": "容易挫败、失去动力", "score": { "ARTS": 1 } },
        { "text_en": "Take a break and return later", "text_zh": "休息后再尝试", "score": { "SCIENCE": 1 } }
      ]
    },
    {
      "id": 15,
      "dimension": "MOT",
      "text_en": "What type of learning environment do you perform best in?",
      "text_zh": "你在哪种学习环境中表现最好？",
      "options": [
        { "text_en": "Structured and rule-based", "text_zh": "有结构和规则的环境", "score": { "ENGINEERING": 2 } },
        { "text_en": "Flexible and creative", "text_zh": "灵活、富有创意的环境", "score": { "ARTS": 2 } },
        { "text_en": "Collaborative and team-oriented", "text_zh": "合作、以团队为主", "score": { "SOCIAL": 2 } },
        { "text_en": "Independent and research-based", "text_zh": "独立研究型", "score": { "SCIENCE": 2 } }
      ]
    }
  ],
   
"result_mapping_logic": {
  "description_en": "Each academic field accumulates total scores from all 15 questions. The field with the highest score determines the recommended major category. The fit level is decided by the total score range.",
  "description_zh": "五大学科方向根据15题累计得分，最高得分领域为推荐学科。匹配等级按总分区间判定。",
  "score_ranges": [
    {
      "range": "0–10",
      "fit_level": "Weak Fit",
      "meaning_en": "Low match — consider exploring other areas or developing this field further.",
      "meaning_zh": "匹配度较低，建议探索其他方向或进一步了解该领域。",
      "recommendation_logic": {
        "ENGINEERING": "Start with STEM or coding basics to test interest.",
        "BUSINESS": "Try business simulations or leadership activities.",
        "ARTS": "Join creative clubs or beginner art classes.",
        "SOCIAL": "Participate in community volunteering.",
        "SCIENCE": "Join science fairs or simple lab workshops."
      }
    },
    {
      "range": "11–20",
      "fit_level": "Moderate Fit",
      "meaning_en": "Moderate match — shows potential with growing interest and ability.",
      "meaning_zh": "中度匹配，显示一定潜力，可通过实践进一步发展。",
      "recommendation_logic": {
        "ENGINEERING": "Consider applied engineering or computing electives.",
        "BUSINESS": "Take introductory business or marketing courses.",
        "ARTS": "Explore design, media, or performing arts minors.",
        "SOCIAL": "Consider education or psychology foundations.",
        "SCIENCE": "Join laboratory or field research programs."
      }
    },
    {
      "range": "21–30",
      "fit_level": "Strong Fit",
      "meaning_en": "High match — strong potential for major study in this field.",
      "meaning_zh": "高度匹配，在该领域具备明显的兴趣与潜能。",
      "recommendation_logic": {
        "ENGINEERING": "Recommend Engineering or Computer Science (HKU / HKUST / PolyU).",
        "BUSINESS": "Recommend Business or Economics (HKU / HKUST / CityU).",
        "ARTS": "Recommend Creative Arts or Humanities (HKBU / LU / HKU).",
        "SOCIAL": "Recommend Education or Social Sciences (EdUHK / CUHK / CityU).",
        "SCIENCE": "Recommend Science or Medicine (HKU / CUHK)."
      }
    }
  ]
},
"result_types": [
  {
    "code": "ENGINEERING",
    "description_en": "Analytical, logical, and problem-solving oriented.",
    "description_zh": "逻辑分析强，擅长解决问题。",
    "recommended_universities": ["HKU", "HKUST", "PolyU"],
    "score_interpretation": {
      "0–10": "Weak Fit — explore basic robotics or coding activities.",
      "11–20": "Moderate Fit — pursue applied science or data analysis courses.",
      "21–30": "Strong Fit — recommend Engineering or Computer Science majors."
    }
  },
  {
    "code": "BUSINESS",
    "description_en": "Leadership and communication strengths with strategic mindset.",
    "description_zh": "具备领导力与沟通力，思维策略性强。",
    "recommended_universities": ["HKU", "HKUST", "CityU"],
    "score_interpretation": {
      "0–10": "Weak Fit — join business clubs to develop interest.",
      "11–20": "Moderate Fit — take BBA or marketing foundation courses.",
      "21–30": "Strong Fit — recommend top-tier Business or Finance programs."
    }
  },
  {
    "code": "ARTS",
    "description_en": "Creative and expressive with emotional insight.",
    "description_zh": "富有创意与情感洞察力。",
    "recommended_universities": ["HKBU", "LU", "HKU"],
    "score_interpretation": {
      "0–10": "Weak Fit — try creative hobbies and workshops.",
      "11–20": "Moderate Fit — explore interdisciplinary art studies.",
      "21–30": "Strong Fit — pursue Creative Media or Humanities degrees."
    }
  },
  {
    "code": "SOCIAL",
    "description_en": "Empathetic, people-centered, and socially aware.",
    "description_zh": "具同理心与社会责任感。",
    "recommended_universities": ["EdUHK", "CUHK", "CityU"],
    "score_interpretation": {
      "0–10": "Weak Fit — engage in volunteering or community projects.",
      "11–20": "Moderate Fit — study Education or Psychology.",
      "21–30": "Strong Fit — recommend Social Science or Education majors."
    }
  },
  {
    "code": "SCIENCE",
    "description_en": "Curious, systematic, and research-driven.",
    "description_zh": "具探索精神与系统思维。",
    "recommended_universities": ["HKU", "CUHK"],
    "score_interpretation": {
      "0–10": "Weak Fit — join school lab activities.",
      "11–20": "Moderate Fit — take Biology or Chemistry electives.",
      "21–30": "Strong Fit — recommend Science or Medicine programs."
    }
  }
]
}
"""
# === Parse and print JSON ===
data = json.loads(json_data)
print(json.dumps(data, indent=2, ensure_ascii=False))
  