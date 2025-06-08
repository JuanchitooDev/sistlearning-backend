export interface IGrupoAdjunto {
    id?: number
    nombre?: string
    nombre_url?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
}

export interface GrupoAdjuntoResponse {
    result: boolean
    message?: string
    data?: IGrupoAdjunto | IGrupoAdjunto[]
    error?: string
    status?: number
}