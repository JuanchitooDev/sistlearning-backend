import xlsx from 'xlsx'

export default class HExcel {
    static generate(data: any) {
        // Crear una hoja de trabajo
        const ws = xlsx.utils.json_to_sheet(data)

        // Crear un libro de trabajo
        const wb = xlsx.utils.book_new()

        // Añadir la hoja de trabajo al libro
        xlsx.utils.book_append_sheet(wb, ws, 'Cumpleaños')

        // Generar un archivo excel en formato buffer
        const excelFile = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' })

        return excelFile
    }
}