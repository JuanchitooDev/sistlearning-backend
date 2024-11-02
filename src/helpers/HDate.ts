export default class HDate {
    static convertDateToString(date: Date): string {
        const meses = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Setiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
        ]

        const dia = date.getDate()
        const mes = meses[date.getMonth()]
        const anio = date.getFullYear()
        
        return `${dia} de ${mes} del ${anio}`
    }
}