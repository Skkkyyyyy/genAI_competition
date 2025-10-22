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
const LOCALHOST = 'http://localhost:8000'
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
		const body = await postJson('/simulate/next', payload)
		// If backend returns structured JSON, pass it through
		if (body && (body.actionResult || body.sceneChange || body.reflectionPrompts)) {
			return { actionResult: body.actionResult, sceneChange: body.sceneChange, reflectionPrompts: body.reflectionPrompts, raw: body }
		}

		// Fallback: if body looks like an LLM response (choices etc.), extract as text
		const text = body?.choices?.[0]?.message?.content ?? body?.text ?? JSON.stringify(body)
		return parseAiText(String(text))
	} catch (err) {
		// If /simulate/next isn't available, fall back to /chat
		try {
			const prompt = buildPromptForChat(p)
			const chatBody = await postJson('/chat', { prompt })
			const text = chatBody?.choices?.[0]?.message?.content ?? chatBody?.result ?? chatBody?.text ?? JSON.stringify(chatBody)
			return parseAiText(String(text))
		} catch (err2) {
			console.error('generateNextScene error', err, err2)
			throw err2
		}
	}
}

function buildPromptForChat(p: GenerateParams) {
	return `Scenario: ${p.scenarioId}\nRound: ${p.round}\nStudentAnswer: ${p.studentAnswer}\nPreviousConflict: ${p.previousConflict || ''}\n\nPlease return in the following format:\n1) Action result + new conflict/event:\n2) Scene change description:\n3) Two reflection questions:`}

// Simple parser that looks for numbered sections in the AI text
function parseAiText(text: string): GenerateResult {
	const res: GenerateResult = { raw: text }
	// split on lines and try to find sections starting with 1), 2), 3) or 1., 2., 3.
	const sections = text.split(/\n(?=\s*[12]\)|\s*[12]\.|\s*1️⃣|\s*2️⃣)/)
	if (sections.length >= 1) res.actionResult = sections[0].trim()
	if (sections.length >= 2) res.sceneChange = sections[1].trim()
	// collect any lines that look like questions for reflection
	const questions = text.match(/(?:\d[)\.|①-⑩]|•|-)?\s*(?:[\u4e00-\u9fff\w].*\?)/g)
	if (questions) res.reflectionPrompts = questions.map((q) => q.trim())
	// fallback: try splitting by lines and taking last two lines as prompts
	if (!res.reflectionPrompts) {
		const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
		if (lines.length >= 2) res.reflectionPrompts = lines.slice(-2)
	}
	return res
}

export default { generateNextScene }

