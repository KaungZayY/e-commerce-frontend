const apiBase = useRuntimeConfig().public.apiBase.replace(/\/+$/, '')

export const useApi = $fetch.create({
    baseURL: `${apiBase}/api`,

    async onRequest({ options }) {
        const headers = new Headers(options.headers as HeadersInit | undefined)

        if (process.client) {
            const token = localStorage.getItem('token')
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
        }

        if (!options.body || !(options.body instanceof FormData)) {
            headers.set('Content-Type', 'application/json')
        }

        options.headers = headers
    },

    async onResponseError({ response }) {
        if (response.status === 401 && process.client) {
            localStorage.removeItem('token')
            const router = useRouter()
            router.push('/auth/login')
        }
    }
})