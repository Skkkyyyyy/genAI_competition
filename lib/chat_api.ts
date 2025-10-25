const LOCALHOST = 'http://192.168.50.64:8000'
const ANDROID_EMULATOR = 'http://10.0.2.2:8000'
function getBackendUrl(): string {
    // Prefer
    if (isAndroidEmulator()) {
        return ANDROID_EMULATOR;
    }
    return LOCALHOST;
}
function isAndroidEmulator(): boolean {
    if (typeof global !== 'undefined' && (global as any).android) return true;
    if (typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent || '')) return true;
    return false;
}
async function postJson(path: string, body: any) {
    const url = `${getBackendUrl()}${path}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Request failed ${res.status}: ${text}`);
    }
    return res.json();
}

// 插入多筆專業
export async function insert_major(scenario: string) {
    try {
        await fetch ("http://192.168.50.64:8000/ai/majors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                actions:"insert",
                majors: [
                    { major_name: "Civil Engineering", degree_type: "BEng", keywords: ["structure","construction"] },
                    { major_name: "Computer Science", degree_type: "BEng", keywords: ["AI","systems"] },
                ]
            }),
        });
    } catch (error) {
        console.error("Error initializing scenario:", error);
    }
}

// 查詢（模糊搜尋）
export async function search_major(faculty: string) {
    try {
        // Use postJson so getBackendUrl() is respected and errors are handled consistently
        const body = await postJson('/ai/majors', { action: 'search', search_text: faculty })

        // Expect the backend to return { ok: true, results: [...{category, description}] }
        if (body && body.ok && Array.isArray(body.results)) {
            return body.results as Array<{ category?: string; description?: string }>;
        }

        // Backwards-compat: if the backend returned an array directly
        if (Array.isArray(body)) return body

        // Unexpected shape
        console.warn('search_major: unexpected response shape', body)
        return []
    } catch (error) {
        console.error('Error searching majors:', error);
        return null;
    }
}
