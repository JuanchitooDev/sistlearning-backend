export interface ITipoDocumento {
    id?: number
    nombre?: string
    nombre_url?: string
    abreviatura?: string
    longitud?: number
    en_persona?: boolean
    en_empresa?: boolean
    compra?: boolean
    venta?: boolean
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
}

export interface TipoDocumentoResponse {
    result: boolean
    message?: string
    data?: ITipoDocumento | ITipoDocumento[]
    error?: string
    status?: number
}