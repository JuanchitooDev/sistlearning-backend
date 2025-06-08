export interface IPais {
    id?: number
    nombre?: string
    nombre_url?: string
    codigo_postal?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
}

export interface PaisResponse {
    result: boolean
    message?: string
    data?: IPais | IPais[]
    error?: string
    status?: number
}