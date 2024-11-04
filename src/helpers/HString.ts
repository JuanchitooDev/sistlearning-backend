export default class HString {
    static convertToUrlString(text: String) {
        let urlString = text.toLocaleLowerCase()

        // Reemplazamos caracteres especiales
        urlString = urlString.normalize("NFD") // Descomponer caracteres acentuados
            .replace(/[\u0300-\u036f]/g, '') // Eliminar marcas diacríticas
            .replace(/ñ/g, 'n') // Convertir ñ a n
            .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres no permitidos
            .trim() // Eliminar espacios al inicio y al final
            .replace(/\s+/g, '-') // Reemplazar espacios por guiones
            .replace(/-+/g, '-') // Eliminar guiones duplicados

        return urlString
    }

    static sanitizeFileName(name: String) {
        return name
            .normalize('NFD') // Normaliza el string
            .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos
            .replace(/[ñ]/g, 'n') // Convierte la eñe a 'n'
            .replace(/[^a-zA-Z0-9-_]/g, '_') // Reemplaza caracteres no permitidos por '_'
            .replace(/\s+/g, '_') // Reemplaza espacios en blanco por '_'
            .toLowerCase(); // Convierte a minúsculas
    };

    static generateCodigo(tamanio: number = 10): string {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let resultado = ''
        for (let i = 0; i < tamanio; i++) {
            const indice = Math.floor(Math.random() * caracteres.length)
            resultado += caracteres[indice]
        }
        return resultado
    }

    static validateField(field: any): string {
        return field !== null && field !== undefined && field != '' ? field : ''
    }

    static validateUbigeo(ubigeo: any): string {
        if (Array.isArray(ubigeo)) {
            return ubigeo.join(",")
        }
        return ''
    }

    static capitalizeNames(nombre: string): string {
        const nombreMinusculas = nombre.toLowerCase()
        const partsNombre = nombreMinusculas.split(' ')
        const partsMayusculas = partsNombre.map(word => word.charAt(0).toUpperCase() + word.slice(1))
        const nombreCapitalized = partsMayusculas.join(' ')
        return nombreCapitalized
    }
}