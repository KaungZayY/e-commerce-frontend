export async function useApiData<T>(url: string, options?: any) {
    const res = await useApi<{ data: T }>(url, options)
    return res.data
}
