const LOCALHOST = 'http://0.0.0.0:8000'
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

export async function FinalResult(response: string) {
    try {
        // Try /simulate/next first (recommended)
        const payload = { response }
        const body = await postJson('/quiz', payload)
        // If backend returns structured JSON, pass it through
        if (body) {
            return { body }
        }
        // If no structured JSON, return the raw response
        return { raw: body }
    } catch (err) {
        console.error('FinalResult error', err)
        throw err
    }
}