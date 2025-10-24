// Helper for Try-A-Major: call the local AI backend to generate the next scene
export type GenerateParams = {
	scenarioId: string
	round: number
	studentAnswer: string
	previousConflict?: string
	// optional: forward the scenario's prompt text for the backend
	scenarioPrompt?: string
	// optional: which system prompt to use on the backend (e.g. 'try-a-major')
	promptType?: string
 	// optional: mark this request as the final round so backend can produce summary
 	isFinal?: boolean
}

export type GenerateResult = {
	actionResult?: string
	sceneChange?: string
	reflectionPrompts?: string[]
	raw?: any
}

// Determine backend URL based on environment. Adjust these values when testing on device/emulator.
const LOCALHOST = 'http://10.68.2.155:8000'
const ANDROID_EMULATOR = 'http://10.0.2.2:8000'

function getBackendUrl(): string {
	// In Expo dev, __DEV__ exists; fall back to localhost otherwise.
	// Prefer 10.0.2.2 for Android emulators by default to avoid common networking issues.
	// If you test on a real device, replace with your machine IP (e.g. http://192.168.1.123:8000).
	if (typeof global !== 'undefined' && (global as any).android) return ANDROID_EMULATOR
	if (typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent || '')) return ANDROID_EMULATOR
	return LOCALHOST
}

async function postJson(path: string, body: any) {
	const url = `${getBackendUrl()}${path}`
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})
	if (!res.ok) {
		const text = await res.text()
		throw new Error(`Request failed ${res.status}: ${text}`)
	}
	return res.json()
}

/**
 * Call the backend to generate the next scene. The backend should accept
 * a structured payload and ideally return a structured JSON. If your
 * backend only exposes /chat (raw LLM), this function will attempt to
 * parse the text into the three fields using simple heuristics.
 */
export async function generateNextScene(p: GenerateParams): Promise<GenerateResult> {
	// Prefer a structured endpoint if available
	try {
		// Try /simulate/next first (recommended)
		const payload = { scenarioId: p.scenarioId, round: p.round, studentAnswer: p.studentAnswer, previousConflict: p.previousConflict, scenarioPrompt: p.scenarioPrompt, promptType: p.promptType, isFinal: p.isFinal }
		const body = await postJson('/sim/action', payload)
		// If backend returns structured JSON, pass it through
		if (body && (body.actionResult || body.sceneChange || body.reflectionPrompts)) {
			return { actionResult: body.actionResult, sceneChange: body.sceneChange, reflectionPrompts: body.reflectionPrompts, raw: body }
		}

		// Fallback: if body looks like an LLM response (choices etc.), extract as text
		const text = body?.choices?.[0]?.message?.content ?? body?.text ?? JSON.stringify(body)
		console.log('generateNextScene raw text:', text)
		return parseAiText(String(text))
	} catch (err) {
		// If /simulate/next isn't available, fall back to /chat
		try {
			const prompt = buildPromptForChat(p)
			const chatBody = await postJson('/llm/chat', { prompt })
			const text = chatBody?.choices?.[0]?.message?.content ?? chatBody?.result ?? chatBody?.text ?? JSON.stringify(chatBody)
			return parseAiText(String(text))
		} catch (err2) {
			console.error('generateNextScene error', err, err2)
			throw err2
		}
	}
}

export async function initialiseScenario(scenario: string) {
	try {
		await fetch ("http://10.68.2.155:8000/sim/start_sim",{
			method:"POST",
			headers:{"Content-Type":"application/json"},
			body: JSON.stringify({ scenario_id: scenario }), // send the scenario id
		}
		)
	} catch (err) {
		console.error('initialiseScenario error', err);
		throw err;
	}
}
function buildPromptForChat(p: GenerateParams) {
	return `Scenario: ${p.scenarioId}\nRound: ${p.round}\nStudentAnswer: ${p.studentAnswer}\nPreviousConflict: ${p.previousConflict || ''}\n\nPlease return in the following format:\n1) Action result + new conflict/event:\n2) Scene change description:\n3) Two reflection questions:`}

// Simple parser that looks for numbered sections in the AI text
export function parseAiText(input: string): GenerateResult {
  let text = (input ?? '').toString()

  // 1) 嘗試解包 JSON：{"response":"..."}
  try {
    const maybe = JSON.parse(text)
    if (maybe && typeof maybe.response === 'string') {
      text = maybe.response
    }
  } catch {
    // 不是 JSON，忽略
  }

  const res: GenerateResult = { raw: text }

  // Quick inline-numbered-section support: some LLM outputs place 1) 2) 3) all on the same line
  // Detect common inline patterns and split them into separate pseudo-blocks first.
  if (/1[\)\.]\s*.+2[\)\.]\s*/s.test(text) || /1️⃣/.test(text) || /一[、.]/.test(text)) {
    const inlineParts = text.split(/(?=\d+[)\.]\s*)/g)
    if (inlineParts.length >= 3) {
      // recompose as blocks separated by blank lines to let the existing logic pick them up
      text = inlineParts.map(p => p.trim()).join('\n\n')
    }
  }

  // 2) 工具：去除段首編號（涵蓋多種樣式）
  const stripHeading = (s: string) =>
    s
      .replace(/^[\s\uFEFF\u00A0]*?(?:\d+[.)]|[①-⑩]|\d+\uFE0F\u20E3|（\d+）|[一二三四五六七八九十]+\s*[、.])\s*/u, '')
      .trim()

  // 3) 工具：取首段/首句（優先首個空行分段，次選句號邊界）
  const firstBlock = (s: string) => (s.split(/\n{2,}/)[0] || s).trim()
  const firstSentence = (s: string) => {
    const m = s.match(
      /.+?(?:[。！？!?\.](?=\s|$)|$)/ // 中英句號/嘆號/問號或到結尾
    )
    return (m ? m[0] : s).trim()
  }

  // 4) 捕獲式正則：提取編號段落（1–9 / ①–⑩ / 1️⃣–9️⃣ / （1） / 一、）
  const blockRe = /(?:^|\n)\s*(?:(\d+)[.)]|([①-⑩])|(\d+\uFE0F\u20E3)|（(\d+)）|([一二三四五六七八九十])\s*[、.])\s*([\s\S]*?)(?=\n\s*(?:\d+[.)]|[①-⑩]|\d+\uFE0F\u20E3|（\d+）|[一二三四五六七八九十]\s*[、.]|$))/gmsu

  const blocks = [...text.matchAll(blockRe)].map((m) =>
    (m[6] ?? '').trim()
  )

  // 若完全沒有匹配到編號段，使用回退策略（按空行粗分）
  let action = ''
  let scene = ''
  let conflict = ''

  if (blocks.length === 0) {
    const rough = text.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean)
    action = rough[0] ?? ''
    scene = rough[1] ?? ''
    conflict = rough[2] ?? ''
  } else {
    action = blocks[0] ?? ''
    scene = blocks[1] ?? ''
    conflict = blocks[2] ?? ''
  }

  // 5) 去段首編號 + 取首段/首句（避免過長）
  if (action) res.actionResult = firstSentence(firstBlock(stripHeading(action)))
  if (scene) res.sceneChange = firstSentence(firstBlock(stripHeading(scene)))

  // 6) 反思題抽取：只抓清單格式 + 問號結尾
  const qMatches =
    text.match(
      /^(?:\s*(?:-|\u2022|\d+[.)]|[①-⑩]|\d+\uFE0F\u20E3|（\d+）|[一二三四五六七八九十]\s*[、.]))\s*(.+\?)\s*$/gm
    ) || []
  const reflectionPrompts = qMatches
    .map((line) =>
      line.replace(
        /^(?:\s*(?:-|\u2022|\d+[.)]|[①-⑩]|\d+\uFE0F\u20E3|（\d+）|[一二三四五六七八九十]\s*[、.]))\s*/,
        ''
      )
    )
    .map((s) => s.trim())
    .filter(Boolean)

  // 7) 若無合法清單式問句，回退：取最後兩行（若有問號）
  if (reflectionPrompts.length > 0) {
    res.reflectionPrompts = reflectionPrompts
  } else {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
    // try to extract questions that might appear inline or multiple in one line
    let lastQs = lines
      .map(l => l.match(/[^-•\d\)\.]*(?:.+?\?)/g) || [])
      .flat()
      .map(s => s.trim())
      .filter(Boolean)
    lastQs = lastQs.slice(-2)
    if (lastQs.length > 0) res.reflectionPrompts = lastQs
  }

  return res
}

export default { generateNextScene }

