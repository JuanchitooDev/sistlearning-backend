export interface ICategoriaEvento {
    id?: number
    nombre?: string
    nombre_url?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
}

export interface CategoriaEventoResponse {
    result: boolean
    message?: string
    data?: ICategoriaEvento | ICategoriaEvento[],
    error?: string
}