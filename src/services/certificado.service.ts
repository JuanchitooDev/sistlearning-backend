import Certificado from '../models/certificado.models'
import { ICertificado, CertificadoResponse } from '../interfaces/certificadoInterface'
import Alumno from '../models/alumno.models';
import Evento from '../models/evento.models';
import AlumnoService from './alumno.service'
import EventoService from './evento.service'
import { IAlumno } from '../interfaces/alumnoInterface';
import { IEvento } from '../interfaces/eventoInterface';
import HString from '../helpers/HString';
import HDate from '../helpers/HDate'
import { PDFDocument, rgb, PDFImage } from 'pdf-lib'
import fs from 'fs';
import path from 'path';
import fontkit from 'fontkit';
import QRCode from 'qrcode'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toZonedTime } from 'date-fns-tz'
import dotenv from 'dotenv'

class CertificadoService {

    async getCertificados(): Promise<CertificadoResponse> {
        try {
            const certificados = await Certificado.findAll({
                attributes: [
                    'id',
                    'id_alumno',
                    'id_evento',
                    'codigo',
                    'codigoQR',
                    'ruta',
                    'fileName',
                    'templateName',
                    'fecha_registro',
                    'fecha_descarga',
                    'fecha_envio',
                    'estado',
                    'nombre_alumno_impresion'
                ],
                include: [
                    {
                        model: Alumno,
                        attributes: [
                            'id',
                            'apellido_paterno',
                            'apellido_materno',
                            'nombres'
                        ]
                    }, {
                        model: Evento,
                        attributes: [
                            'id',
                            'titulo',
                            'fecha',
                            'fecha_fin',
                            'duracion'
                        ]
                    }
                ],
                order: [
                    ['id', 'DESC']
                ]
            })
            return { result: true, data: certificados }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async getCertificadoById(id: number): Promise<CertificadoResponse> {
        try {
            const certificado = await Certificado.findByPk(id, {
                attributes: [
                    'id',
                    'id_alumno',
                    'id_evento',
                    'codigo',
                    'codigoQR',
                    'ruta',
                    'fileName',
                    'fecha_registro',
                    'fecha_descarga',
                    'templateName',
                    'fecha_envio',
                    'estado',
                    'nombre_alumno_impresion'
                ],
                include: [
                    {
                        model: Alumno,
                        attributes: [
                            'id',
                            'apellido_paterno',
                            'apellido_materno',
                            'nombres',
                            'nombre_capitalized'
                        ]
                    }, {
                        model: Evento,
                        attributes: [
                            'id',
                            'titulo',
                            'fecha',
                            'fecha_fin',
                            'duracion'
                        ]
                    }
                ]
            })
            if (!certificado) {
                return { result: false, message: 'Certificado no encontrado' }
            }
            return { result: true, data: certificado }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async getCertificadoByCodigo(codigo: string): Promise<CertificadoResponse> {
        try {
            const certificado = await Certificado.findOne({
                where: { codigo },
                attributes: [
                    'id',
                    'id_alumno',
                    'id_evento',
                    'codigo',
                    'codigoQR',
                    'ruta',
                    'fileName',
                    'fecha_registro',
                    'fecha_descarga',
                    'templateName',
                    'fecha_envio',
                    'estado',
                    'nombre_alumno_impresion'
                ],
                include: [
                    {
                        model: Alumno,
                        attributes: [
                            'id',
                            'apellido_paterno',
                            'apellido_materno',
                            'nombres',
                            'nombre_capitalized'
                        ]
                    }, {
                        model: Evento,
                        attributes: [
                            'id',
                            'titulo',
                            'fecha',
                            'fecha_fin',
                            'duracion'
                        ]
                    }
                ]
            })
            if (!certificado) {
                return { result: false, message: 'Certificado no encontrado' }
            }
            return { result: true, data: certificado }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async downloadCertificado(id: number) {
        try {
            const responseCertificado = await this.getCertificadoById(id)
            if (responseCertificado.result) {
                const certificado = responseCertificado.data as ICertificado
                const outputPath = certificado.ruta as string
                const fileName = certificado.fileName as string

                // Verificar si el archivo existe antes de descargarlo
                if (fs.existsSync(outputPath)) {
                    const result = {
                        result: true,
                        message: 'Certificado encontrado',
                        outputPath,
                        fileName
                    }
                    return result
                } else {
                    return { result: false, message: 'Certificado no encontrado', outputPath: null, fileName: null }
                }
            } else {
                return { result: false, error: responseCertificado.error, outputPath: null, fileName: null }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async createCertificado(data: ICertificado): Promise<CertificadoResponse> {
        try {
            const id_alumno = data.id_alumno
            const id_evento = data.id_evento

            const fechaEnvio = toZonedTime(data.fecha_envio as Date, 'America/Lima')

            const alumnoResponse = await AlumnoService.getAlumnoById(id_alumno as number)

            if (!alumnoResponse.result) {
                if (alumnoResponse.error) {
                    return { result: false, error: alumnoResponse.error }
                } else {
                    return { result: false, message: alumnoResponse.message }
                }
            }

            const alumno = alumnoResponse.data as IAlumno

            const eventoResponse = await EventoService.getEventoById(id_evento as number)
            if (!eventoResponse.result) {
                if (eventoResponse.error) {
                    return { result: false, error: eventoResponse.error }
                } else {
                    return { result: false, message: eventoResponse.message }
                }
            }

            const evento = eventoResponse.data as IEvento

            // console.log('evento in createCertificado', evento)

            const nombreAlumnoImpresion = (data.nombre_alumno_impresion === undefined)
                ? `${alumno.nombre_capitalized}`
                : HString.capitalizeNames(data.nombre_alumno_impresion)

            data.nombre_alumno_impresion = nombreAlumnoImpresion

            // Generar un nuevo archivo PDF
            const { result, message, dataResult } = await this.generateCertificadoPDF(data, alumno, evento)

            if (!result) {
                return { result, message }
            }

            const outputPath = dataResult?.outputPath
            const fileName = dataResult?.fileName
            const codigoQR = dataResult?.codigoQR
            const codigo = dataResult?.codigo

            data.fecha_envio = fechaEnvio
            data.fecha_registro = new Date()
            data.ruta = outputPath
            data.fileName = fileName
            data.codigoQR = codigoQR
            data.codigo = codigo

            const newCertificado = await Certificado.create(data as any)
            if (newCertificado.id) {
                return { result: true, message: 'Certificado registrado correctamente', data: newCertificado }
            } else {
                return { result: false, message: 'Error al registrar el certificado' }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async updateCertificado(id: number, data: ICertificado): Promise<CertificadoResponse> {
        try {
            const fechaEnvio = toZonedTime(data.fecha_envio as Date, 'America/Lima')
            const certificado = await Certificado.findByPk(id)

            if (!certificado) {
                return { result: false, message: 'Certificado no encontrado' }
            }

            if (
                data.id_alumno !== certificado.id_alumno ||
                data.id_evento !== certificado.id_evento ||
                data.nombre_alumno_impresion !== certificado.nombre_alumno_impresion ||
                data.fecha_envio !== certificado.fecha_envio
            ) {
                const alumnoResponse = await AlumnoService.getAlumnoById(data.id_alumno as number)
                if (!alumnoResponse.result) {
                    if (alumnoResponse.error) {
                        return { result: false, error: alumnoResponse.error }
                    } else {
                        return { result: false, message: alumnoResponse.message }
                    }
                }
                const alumno = alumnoResponse.data as IAlumno

                const eventoResponse = await EventoService.getEventoById(data.id_evento as number)
                if (!eventoResponse.result) {
                    if (eventoResponse.error) {
                        return { result: false, error: eventoResponse.error }
                    } else {
                        return { result: false, message: eventoResponse.message }
                    }
                }

                const evento = eventoResponse.data as IEvento

                // Reemplazar el archivo anterior si existe
                if (fs.existsSync(certificado.ruta as string)) {
                    fs.unlinkSync(certificado.ruta as string); // Eliminar el archivo anterior
                }

                const nombreAlumnoImpresion = (data.nombre_alumno_impresion === undefined)
                    ? `${alumno.nombre_capitalized}`
                    : HString.capitalizeNames(data.nombre_alumno_impresion)

                data.id = certificado.id
                data.codigo = certificado.codigo
                data.codigoQR = certificado.codigoQR
                data.ruta = certificado.ruta
                data.nombre_alumno_impresion = nombreAlumnoImpresion

                // Generar un nuevo archivo PDF
                const { result, message, dataResult } = await this.generateCertificadoPDF(data, alumno, evento)

                if (!result) {
                    return { result, message }
                }

                const outputPath = dataResult?.outputPath
                const fileName = dataResult?.fileName
                const codigoQR = dataResult?.codigoQR
                const codigo = dataResult?.codigo

                // Actualizar la base de datos con la nueva ruta y los nuevos datos
                data.ruta = outputPath;
                data.fileName = fileName;
                data.codigoQR = codigoQR;
                data.codigo = codigo;
                data.fecha_envio = fechaEnvio

                // Actualizamos el registro en la base de datos
                const updatedCertificado = await certificado.update(data);
                return { result: true, message: 'Certificado actualizado con éxito', data: updatedCertificado };
            } else {
                // Si no hay cambios que afecten el archivo, solo actualizamos los datos del certificado
                data.fecha_envio = fechaEnvio;
                const updatedCertificado = await certificado.update(data);
                return { result: true, message: 'Certificado actualizado con éxito', data: updatedCertificado };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async deleteCertificado(id: number): Promise<CertificadoResponse> {
        try {
            const certificado = await Certificado.findByPk(id);
            if (!certificado) {
                return { result: false, message: 'Certificado no encontrado' };
            }

            // Eliminar el archivo del sistema de archivos
            const outputPath = certificado.ruta as string
            if (fs.existsSync(outputPath)) {
                fs.unlinkSync(outputPath)
            }

            await certificado.destroy();
            return { result: true, data: { id }, message: 'Certificado eliminado correctamente' };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage };
        }
    }

    // Método auxiliar para generar el PDF del certificado
    async generateCertificadoPDF(data: ICertificado, alumno: IAlumno, evento: IEvento) {
        try {
            let codigo = ""
            let fechaFinalStr = ""
            let fechasEvento = []

            const lugar = 'Lambayeque';
            const pathTemplate = path.resolve(__dirname, `../../public/pdf/${evento.plantilla_certificado}.pdf`);
            const pathFontKuenstler = path.resolve(__dirname, '../../public/fonts/KUNSTLER.TTF')
            const pathFontKuenstlerBold = path.resolve(__dirname, "../../public/fonts/Kuenstler Script LT Std 2 Bold.otf");
            const pathFontBalooBold = path.resolve(__dirname, '../../public/fonts/BalooChettan2-Bold.ttf')
            const pathFontBalooMedium = path.resolve(__dirname, '../../public/fonts/BalooChettan2-Medium.ttf')
            const pathLogo = path.resolve(__dirname, '../../public/img/logo_transparente_small.png')

            if (!fs.existsSync(pathTemplate)) {
                return { result: false, message: `No existe la plantilla ${evento.plantilla_certificado}` }
            }

            if (!fs.existsSync(pathFontKuenstler)) {
                return { result: false, message: `No existe fuente KUNSTLER.TTF` }
            }

            if (!fs.existsSync(pathFontKuenstlerBold)) {
                return { result: false, message: `Kuenstler Script LT Std 2 Bold.otf` }
            }

            if (!fs.existsSync(pathFontBalooBold)) {
                return { result: false, message: `No existe fuente BalooChettan2-Bold.ttf` }
            }

            if (!fs.existsSync(pathFontBalooMedium)) {
                return { result: false, message: `No existe fuente BalooChettan2-Medium.ttf` }
            }

            if (!fs.existsSync(pathLogo)) {
                return { result: false, message: `No existe el logo` }
            }

            const nombreImpresion = data.nombre_alumno_impresion as string;
            const tituloEvento = evento.titulo as string
            const fechaEvento = HDate.convertDateToString(evento.fecha as Date)
            const temarioEvento = evento.temario?.split('\n') as String[]

            const fechaInicio = toZonedTime(evento.fecha as Date, 'America/Lima')
            const fechaInicioStr = format(fechaInicio, "dd 'de' MMMM 'del' yyyy", { locale: es })

            // Definiendo el nombre del archivo
            const sanitizedTitulo = HString.sanitizeFileName(evento.titulo as string)
            const sanitizedAlumno = HString.sanitizeFileName(alumno.nombre_capitalized as string)
            const fileName = `certificado_${sanitizedAlumno}.pdf`
            const outputPath = path.resolve(__dirname, `../../public/certificados/${sanitizedTitulo}/${fileName}`)

            // Definiendo la fecha de emisión
            const fechaEnvio = toZonedTime(data.fecha_envio as Date, 'America/Lima')

            const fechaEmision = format(fechaEnvio, "dd 'de' MMMM 'del' yyyy", { locale: es })
            const lugarFechaEmision = `${lugar}, ${fechaEmision}`

            if (evento.fecha_fin) {
                const fechaFinal = toZonedTime(evento.fecha_fin, 'America/Lima')
                fechasEvento.push(`${fechaInicioStr} al`)
                fechaFinalStr = format(fechaFinal, "dd 'de' MMMM 'del' yyyy", { locale: es })
                fechasEvento.push(fechaFinalStr)
            } else {
                fechasEvento.push(`${fechaInicioStr}`)
            }

            // Código del certificado
            if (data.id) {
                codigo = data.codigo as string
            } else {
                codigo = HString.generateCodigo()
            }

            // Actualizando la plantilla del certificado
            data.templateName = evento.plantilla_certificado

            // Verificando que el directorio de salida exista, sino se crea
            const outputDir = path.dirname(outputPath)
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true })
            }

            // Cargar el PDF de plantilla
            const templateBytes = fs.readFileSync(pathTemplate);
            const pdfDoc = await PDFDocument.load(templateBytes);

            // Registrar fontkit
            pdfDoc.registerFontkit(fontkit as any)

            // Cargar la fuente
            const fontKuenstlerBold = fs.readFileSync(pathFontKuenstlerBold)
            const customFontKuenstlerBold = await pdfDoc.embedFont(fontKuenstlerBold)

            const fontKuenstler = fs.readFileSync(pathFontKuenstler)
            const customFontKuenstler = await pdfDoc.embedFont(fontKuenstler)

            // Cargar otra fuentes
            const fontBalooBold = fs.readFileSync(pathFontBalooBold)
            const customFontBalooBold = await pdfDoc.embedFont(fontBalooBold)

            const fontBalooMedium = fs.readFileSync(pathFontBalooMedium)
            const customFontBalooMedium = await pdfDoc.embedFont(fontBalooMedium)

            // Obtener la primera página
            const pagina = pdfDoc.getPage(0)

            let fontSizeForAlumno = 0
            let y = 0
            let x = 0
            let maxWidth = 0
            let fontSizeForEvento = 0
            let fontSizeForFechaEvento = 0
            let fontSizeForFechaEmision = 0
            let linesAlumno = []
            let lineWidthAlumno = 0
            let lineHeightAlumno = 0
            let linesEvento = []
            let lineWidthEvento = 0
            let lineHeightEvento = 0
            let lineWidthFechaEvento = 0
            let fechaEventoPositionX = 0

            // Obtener el ancho de la página
            const pageWidth = pagina.getWidth();
            // console.log('pageWidth', pageWidth)

            switch (evento.plantilla_certificado) {
                case "buenas_practicas_agricolas_para_una_produccion_sostenible":
                case "como_maximizar_la_produccion_de_gallinas_saludables":
                case "nutricion_alimentacion_y_sanidad_de_animales_menores_y_mayores":
                case "sanidad_avicola_y_optimizacion_productiva":

                    // Configurar el texto del nombre del alumno
                    fontSizeForAlumno = 54;

                    y = 302;  // Posición Y
                    maxWidth = 720; // Ancho máximo disponible para el texto

                    // Distancia entre líneas para el nombre del alumno
                    lineHeightAlumno = 0.8 * fontSizeForAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForAlumno);

                    if (linesAlumno.length > 1) {
                        // y += 30;
                        fontSizeForAlumno = 50;
                    }

                    // Dibujar el nombre del alumno centrado
                    for (let i = 0; i < linesAlumno.length; i++) {
                        lineWidthAlumno = customFontKuenstlerBold.widthOfTextAtSize(linesAlumno[i], fontSizeForAlumno);
                        const nombrePositionX = (pageWidth - lineWidthAlumno) / 2;  // Centrado horizontal

                        pagina.drawText(linesAlumno[i], {
                            x: nombrePositionX,
                            y: y - i * lineHeightAlumno,
                            size: fontSizeForAlumno,
                            font: customFontKuenstlerBold,
                            color: rgb(0, 0, 0),
                        });
                    }

                    // Configurar el texto del título del evento
                    fontSizeForEvento = 30;
                    maxWidth = 640
                    y -= 70; // Ajustar la posición Y para el siguiente texto

                    // Distancia entre líneas para el nombre del evento
                    lineHeightEvento = 1.2 * fontSizeForEvento;

                    // Dividir el título del evento si es necesario
                    linesEvento = this.splitTextIntoLines(tituloEvento, maxWidth, customFontBalooBold, fontSizeForEvento);
                    // console.log('linesEvento', linesEvento)

                    for (let i = 0; i < linesEvento.length; i++) {
                        lineWidthEvento = customFontBalooBold.widthOfTextAtSize(linesEvento[i], fontSizeForEvento);
                        const tituloEventoPositionX = (pageWidth - lineWidthEvento) / 2;  // Centrado horizontal

                        // Dibujar el título del evento centrado
                        pagina.drawText(linesEvento[i], {
                            x: tituloEventoPositionX,
                            y: y - i * lineHeightEvento,
                            size: fontSizeForEvento,
                            font: customFontBalooBold,
                            color: rgb(4 / 255, 45 / 255, 71 / 255),
                        });
                    }

                    // Configurar el texto de la fecha del evento
                    fontSizeForFechaEvento = 24;
                    y -= 70; // Ajustar la posición Y para el siguiente texto

                    lineWidthFechaEvento = customFontBalooMedium.widthOfTextAtSize(fechaEvento, fontSizeForFechaEvento);
                    fechaEventoPositionX = (pageWidth - lineWidthFechaEvento) / 2;  // Centrado horizontal

                    // Dibujar la fecha del evento centrado
                    pagina.drawText(fechaEvento, {
                        x: fechaEventoPositionX,
                        y,
                        size: fontSizeForFechaEvento,
                        font: customFontBalooMedium,
                        color: rgb(4 / 255, 45 / 255, 71 / 255),
                    });
                    break
                case "cultivos_saludables":
                case "manejo_de_cultivo_de_arroz":
                case "manejo_moderno_de_ovinos":
                case "metodo_integral_de_prevencion_diagnostico_y_control_de_enfermedades":
                case "optimizacion_de_la_produccion_porcina":
                case "tecnicas_avanzadas_para_produccion_sostenible_en_cuyes":
                case "uso_de_excel_para_interpretar_analisis_de_suelo_y_agua":

                    // Configurar el texto del nombre del alumno
                    fontSizeForAlumno = 48;

                    y = 345;  // Posición Y
                    maxWidth = 720; // Ancho máximo disponible para el texto

                    // Distancia entre líneas para el nombre del alumno
                    lineHeightAlumno = 0.8 * fontSizeForAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForAlumno);

                    if (linesAlumno.length > 1) {
                        // y += 30;
                        fontSizeForAlumno = 44;
                    }

                    // Dibujar el nombre del alumno centrado
                    for (let i = 0; i < linesAlumno.length; i++) {
                        lineWidthAlumno = customFontKuenstlerBold.widthOfTextAtSize(linesAlumno[i], fontSizeForAlumno);
                        const nombrePositionX = (pageWidth - lineWidthAlumno) / 2;  // Centrado horizontal

                        pagina.drawText(linesAlumno[i], {
                            x: nombrePositionX,
                            y: y - i * lineHeightAlumno,
                            size: fontSizeForAlumno,
                            font: customFontKuenstlerBold,
                            color: rgb(0, 0, 0),
                        });
                    }

                    // Configurar el texto del título del evento
                    fontSizeForEvento = 30;
                    maxWidth = 640
                    y -= 70; // Ajustar la posición Y para el siguiente texto

                    // Distancia entre líneas para el nombre del evento
                    lineHeightEvento = 1.2 * fontSizeForEvento;

                    // Dividir el título del evento si es necesario
                    linesEvento = this.splitTextIntoLines(tituloEvento, maxWidth, customFontBalooBold, fontSizeForEvento);
                    // console.log('linesEvento', linesEvento)

                    for (let i = 0; i < linesEvento.length; i++) {
                        lineWidthEvento = customFontBalooBold.widthOfTextAtSize(linesEvento[i], fontSizeForEvento);
                        const tituloEventoPositionX = (pageWidth - lineWidthEvento) / 2;  // Centrado horizontal

                        // Dibujar el título del evento centrado
                        pagina.drawText(linesEvento[i], {
                            x: tituloEventoPositionX,
                            y: y - i * lineHeightEvento,
                            size: fontSizeForEvento,
                            font: customFontBalooBold,
                            color: rgb(4 / 255, 45 / 255, 71 / 255),
                        });
                    }

                    // Configurar el texto de la fecha del evento
                    fontSizeForFechaEvento = 24;
                    y -= 70; // Ajustar la posición Y para el siguiente texto

                    lineWidthFechaEvento = customFontBalooMedium.widthOfTextAtSize(fechaEvento, fontSizeForFechaEvento);
                    fechaEventoPositionX = (pageWidth - lineWidthFechaEvento) / 2;  // Centrado horizontal

                    // Dibujar la fecha del evento centrado
                    pagina.drawText(fechaEvento, {
                        x: fechaEventoPositionX,
                        y,
                        size: fontSizeForFechaEvento,
                        font: customFontBalooMedium,
                        color: rgb(4 / 255, 45 / 255, 71 / 255),
                    });
                    break
                case "formulacion_y_evaluacion_de_proyectos_agropecuarios":
                case "manejo_de_camelidos_sudamericanos":
                    // Configurar el texto del nombre del alumno
                    fontSizeForAlumno = 48;

                    y = 365;  // Posición Y
                    maxWidth = 720; // Ancho máximo disponible para el texto

                    // Distancia entre líneas para el nombre del alumno
                    lineHeightAlumno = 0.8 * fontSizeForAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForAlumno);

                    if (linesAlumno.length > 1) {
                        // y += 30;
                        fontSizeForAlumno = 44;
                    }

                    // Dibujar el nombre del alumno centrado
                    for (let i = 0; i < linesAlumno.length; i++) {
                        lineWidthAlumno = customFontKuenstlerBold.widthOfTextAtSize(linesAlumno[i], fontSizeForAlumno);
                        const nombrePositionX = (pageWidth - lineWidthAlumno) / 2;  // Centrado horizontal

                        pagina.drawText(linesAlumno[i], {
                            x: nombrePositionX,
                            y: y - i * lineHeightAlumno,
                            size: fontSizeForAlumno,
                            font: customFontKuenstlerBold,
                            color: rgb(0, 0, 0),
                        });
                    }

                    // Configurar el texto del título del evento
                    fontSizeForEvento = 30;
                    maxWidth = 600
                    y -= 90; // Ajustar la posición Y para el siguiente texto

                    // Distancia entre líneas para el nombre del evento
                    lineHeightEvento = 0.8 * fontSizeForEvento;

                    // Dividir el título del evento si es necesario
                    linesEvento = this.splitTextIntoLines(tituloEvento, maxWidth, customFontBalooBold, fontSizeForEvento);
                    // console.log('linesEvento', linesEvento)

                    for (let i = 0; i < linesEvento.length; i++) {
                        lineWidthEvento = customFontBalooBold.widthOfTextAtSize(linesEvento[i], fontSizeForEvento);
                        const tituloEventoPositionX = (pageWidth - lineWidthEvento) / 2;  // Centrado horizontal

                        // Dibujar el título del evento centrado
                        pagina.drawText(linesEvento[i], {
                            x: tituloEventoPositionX,
                            y: y - i * lineHeightEvento,
                            size: fontSizeForEvento,
                            font: customFontBalooBold,
                            color: rgb(0 / 255, 32 / 255, 58 / 255),
                        });
                    }

                    // Configurar el texto de la fecha del evento
                    fontSizeForFechaEvento = 24;
                    y -= 60; // Ajustar la posición Y para el siguiente texto

                    lineWidthFechaEvento = customFontBalooMedium.widthOfTextAtSize(fechaEvento, fontSizeForFechaEvento);
                    fechaEventoPositionX = (pageWidth - lineWidthFechaEvento) / 2;  // Centrado horizontal

                    // Dibujar la fecha del evento centrado
                    pagina.drawText(fechaEvento, {
                        x: fechaEventoPositionX,
                        y,
                        size: fontSizeForFechaEvento,
                        font: customFontBalooMedium,
                        color: rgb(222 / 255, 148 / 255, 40 / 255),
                    });
                    break
                case "hidroponia_y_calculo_de_soluciones_nutritivas":
                    // Configurar el texto del nombre del alumno
                    fontSizeForAlumno = 48;

                    y = 348;  // Posición Y
                    maxWidth = 640; // Ancho máximo disponible para el texto

                    // Distancia entre líneas para el nombre del alumno
                    lineHeightAlumno = 0.8 * fontSizeForAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForAlumno);

                    if (linesAlumno.length > 1) {
                        // y += 30;
                        fontSizeForAlumno = 44;
                    }

                    // Dibujar el nombre del alumno centrado
                    for (let i = 0; i < linesAlumno.length; i++) {
                        lineWidthAlumno = customFontKuenstlerBold.widthOfTextAtSize(linesAlumno[i], fontSizeForAlumno);
                        // const nombrePositionX = (pageWidth - lineWidthAlumno) / 2;  // Centrado horizontal
                        // const nombrePositionX = 60
                        const nombrePositionX = 60 + (maxWidth - lineWidthAlumno) / 2;  // Centrado en el área de 640 píxeles, comenzando en X = 60

                        pagina.drawText(linesAlumno[i], {
                            x: nombrePositionX,
                            y: y - i * lineHeightAlumno,
                            size: fontSizeForAlumno,
                            font: customFontKuenstlerBold,
                            color: rgb(0, 0, 0),
                        });
                    }

                    // Configurar el texto del título del evento
                    fontSizeForEvento = 30;
                    maxWidth = 580
                    y -= 80; // Ajustar la posición Y para el siguiente texto

                    // Distancia entre líneas para el nombre del evento
                    lineHeightEvento = 0.8 * fontSizeForEvento;

                    // Dividir el título del evento si es necesario
                    linesEvento = this.splitTextIntoLines(tituloEvento, maxWidth, customFontBalooBold, fontSizeForEvento);
                    // console.log('linesEvento', linesEvento)

                    for (let i = 0; i < linesEvento.length; i++) {
                        lineWidthEvento = customFontBalooBold.widthOfTextAtSize(linesEvento[i], fontSizeForEvento);
                        // const tituloEventoPositionX = (pageWidth - lineWidthEvento) / 2;  // Centrado horizontal
                        // const tituloEventoPositionX = 60
                        const tituloEventoPositionX = 60 + (maxWidth - lineWidthEvento) / 2;  // Centrado en el área de 640 píxeles, comenzando en X = 60

                        // Dibujar el título del evento centrado
                        pagina.drawText(linesEvento[i], {
                            x: tituloEventoPositionX,
                            y: y - i * lineHeightEvento,
                            size: fontSizeForEvento,
                            font: customFontBalooBold,
                            color: rgb(0 / 255, 32 / 255, 58 / 255),
                        });
                    }

                    // Configurar el texto de la fecha del evento
                    fontSizeForFechaEvento = 24;
                    y -= 70; // Ajustar la posición Y para el siguiente texto

                    lineWidthFechaEvento = customFontBalooMedium.widthOfTextAtSize(fechaEvento, fontSizeForFechaEvento);
                    // positionXFechaEvento = (pageWidth - lineWidthFechaEvento) / 2;  // Centrado horizontal
                    // positionXFechaEvento = 60
                    fechaEventoPositionX = 60 + (maxWidth - lineWidthFechaEvento) / 2;  // Centrado en el área de 640 píxeles, comenzando en X = 60

                    // Dibujar la fecha del evento centrado
                    pagina.drawText(fechaEvento, {
                        x: fechaEventoPositionX,
                        y,
                        size: fontSizeForFechaEvento,
                        font: customFontBalooMedium,
                        color: rgb(222 / 255, 148 / 255, 40 / 255),
                    });
                    break
                case "manejo_integrado_de_la_roya_del_cafe":
                    // Configurar el texto del nombre del alumno
                    fontSizeForAlumno = 48;

                    y = 345;  // Posición Y
                    maxWidth = 720; // Ancho máximo disponible para el texto

                    // Distancia entre líneas para el nombre del alumno
                    lineHeightAlumno = 0.8 * fontSizeForAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForAlumno);

                    if (linesAlumno.length > 1) {
                        // y += 30;
                        fontSizeForAlumno = 44;
                    }

                    // Dibujar el nombre del alumno centrado
                    for (let i = 0; i < linesAlumno.length; i++) {
                        lineWidthAlumno = customFontKuenstlerBold.widthOfTextAtSize(linesAlumno[i], fontSizeForAlumno);
                        const nombrePositionX = (pageWidth - lineWidthAlumno) / 2;  // Centrado horizontal

                        pagina.drawText(linesAlumno[i], {
                            x: nombrePositionX,
                            y: y - i * lineHeightAlumno,
                            size: fontSizeForAlumno,
                            font: customFontKuenstlerBold,
                            color: rgb(0, 0, 0),
                        });
                    }

                    // Configurar el texto del título del evento
                    fontSizeForEvento = 30;
                    maxWidth = 480
                    y -= 90; // Ajustar la posición Y para el siguiente texto

                    // Distancia entre líneas para el nombre del evento
                    lineHeightEvento = 0.8 * fontSizeForEvento;

                    // Dividir el título del evento si es necesario
                    linesEvento = this.splitTextIntoLines(tituloEvento, maxWidth, customFontBalooBold, fontSizeForEvento);
                    // console.log('linesEvento', linesEvento)

                    for (let i = 0; i < linesEvento.length; i++) {
                        lineWidthEvento = customFontBalooBold.widthOfTextAtSize(linesEvento[i], fontSizeForEvento);
                        const tituloEventoPositionX = (pageWidth - lineWidthEvento) / 2;  // Centrado horizontal

                        // Dibujar el título del evento centrado
                        pagina.drawText(linesEvento[i], {
                            x: tituloEventoPositionX,
                            y: y - i * lineHeightEvento,
                            size: fontSizeForEvento,
                            font: customFontBalooBold,
                            color: rgb(0 / 255, 32 / 255, 58 / 255),
                        });
                    }

                    // Configurar el texto de la fecha del evento
                    fontSizeForFechaEvento = 24;
                    y -= 60; // Ajustar la posición Y para el siguiente texto

                    lineWidthFechaEvento = customFontBalooMedium.widthOfTextAtSize(fechaEvento, fontSizeForFechaEvento);
                    fechaEventoPositionX = (pageWidth - lineWidthFechaEvento) / 2;  // Centrado horizontal

                    // Dibujar la fecha del evento centrado
                    pagina.drawText(fechaEvento, {
                        x: fechaEventoPositionX,
                        y,
                        size: fontSizeForFechaEvento,
                        font: customFontBalooMedium,
                        color: rgb(222 / 255, 148 / 255, 40 / 255),
                    });
                    break
                case "manejo_sanitario_de_cuyes_con_fines_comerciales":
                    // Configurar el texto del nombre del alumno
                    fontSizeForAlumno = 60;

                    y = 300;  // Posición Y
                    maxWidth = 500; // Ancho máximo disponible para el texto

                    // Distancia entre líneas para el nombre del alumno
                    lineHeightAlumno = 0.8 * fontSizeForAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForAlumno);

                    if (linesAlumno.length > 1) {
                        // y += 30;
                        fontSizeForAlumno = 54;
                    }

                    // Dibujar el nombre del alumno centrado
                    for (let i = 0; i < linesAlumno.length; i++) {
                        lineWidthAlumno = customFontKuenstlerBold.widthOfTextAtSize(linesAlumno[i], fontSizeForAlumno);
                        // const nombrePositionX = (pageWidth - lineWidthAlumno) / 2;  // Centrado horizontal
                        // const nombrePositionX = 60
                        const nombrePositionX = 200 + ((maxWidth - lineWidthAlumno) / 2);  // Centrado en el área de 640 píxeles, comenzando en X = 60

                        pagina.drawText(linesAlumno[i], {
                            x: nombrePositionX,
                            y: y - i * lineHeightAlumno,
                            size: fontSizeForAlumno,
                            font: customFontKuenstlerBold,
                            color: rgb(0, 0, 0),
                        });
                    }

                    // Configurar el texto del título del evento
                    fontSizeForEvento = 16;
                    x = 310
                    y = 206

                    // Dibujar el título del evento centrado
                    pagina.drawText(evento.titulo as string, {
                        x,
                        y,
                        size: fontSizeForEvento,
                        font: customFontBalooBold,
                        color: rgb(4 / 255, 45 / 255, 71 / 255),
                    });

                    // maxWidth = 580
                    // y -= 80; // Ajustar la posición Y para el siguiente texto

                    // // Distancia entre líneas para el nombre del evento
                    // lineHeightEvento = 0.8 * fontSizeForEvento;

                    // // Dividir el título del evento si es necesario
                    // linesEvento = this.splitTextIntoLines(tituloEvento, maxWidth, customFontBalooBold, fontSizeForEvento);
                    // // console.log('linesEvento', linesEvento)

                    // for (let i = 0; i < linesEvento.length; i++) {
                    //     lineWidthEvento = customFontBalooBold.widthOfTextAtSize(linesEvento[i], fontSizeForEvento);
                    //     // const tituloEventoPositionX = (pageWidth - lineWidthEvento) / 2;  // Centrado horizontal
                    //     // const tituloEventoPositionX = 60
                    //     const tituloEventoPositionX = 60 + (maxWidth - lineWidthEvento) / 2;  // Centrado en el área de 640 píxeles, comenzando en X = 60

                    //     // Dibujar el título del evento centrado
                    //     pagina.drawText(linesEvento[i], {
                    //         x: tituloEventoPositionX,
                    //         y: y - i * lineHeightEvento,
                    //         size: fontSizeForEvento,
                    //         font: customFontBalooBold,
                    //         color: rgb(0 / 255, 32 / 255, 58 / 255),
                    //     });
                    // }

                    // Configurar el texto de la fecha del evento
                    fontSizeForFechaEvento = 12;
                    x += 123
                    y -= 36

                    // Dibujar la fecha del evento centrado
                    pagina.drawText(fechaEvento, {
                        x,
                        y,
                        size: fontSizeForFechaEvento,
                        font: customFontBalooMedium,
                        color: rgb(4 / 255, 45 / 255, 71 / 255),
                    });

                    // y -= 70; // Ajustar la posición Y para el siguiente texto

                    // lineWidthFechaEvento = customFontBalooMedium.widthOfTextAtSize(fechaEvento, fontSizeForFechaEvento);
                    // // positionXFechaEvento = (pageWidth - lineWidthFechaEvento) / 2;  // Centrado horizontal
                    // // positionXFechaEvento = 60
                    // fechaEventoPositionX = 60 + (maxWidth - lineWidthFechaEvento) / 2;  // Centrado en el área de 640 píxeles, comenzando en X = 60

                    // // Dibujar la fecha del evento centrado
                    // pagina.drawText(fechaEvento, {
                    //     x: fechaEventoPositionX,
                    //     y,
                    //     size: fontSizeForFechaEvento,
                    //     font: customFontBalooMedium,
                    //     color: rgb(222 / 255, 148 / 255, 40 / 255),
                    // });

                    fontSizeForFechaEmision = 13
                    x += 120
                    y -= 50

                    // Dibujar la fecha del evento centrado
                    pagina.drawText(lugarFechaEmision, {
                        x,
                        y,
                        size: fontSizeForFechaEmision,
                        font: customFontBalooMedium,
                        color: rgb(4 / 255, 45 / 255, 71 / 255),
                    });

                    break
                case "sanidad_integral_en_cuyes":
                    // Configurar el texto del nombre del alumno
                    fontSizeForAlumno = 48;

                    y = 390;  // Posición Y
                    maxWidth = 720; // Ancho máximo disponible para el texto

                    // Distancia entre líneas para el nombre del alumno
                    lineHeightAlumno = 0.8 * fontSizeForAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForAlumno);

                    if (linesAlumno.length > 1) {
                        // y += 30;
                        fontSizeForAlumno = 44;
                    }

                    // Dibujar el nombre del alumno centrado
                    for (let i = 0; i < linesAlumno.length; i++) {
                        lineWidthAlumno = customFontKuenstlerBold.widthOfTextAtSize(linesAlumno[i], fontSizeForAlumno);
                        const nombrePositionX = (pageWidth - lineWidthAlumno) / 2;  // Centrado horizontal

                        pagina.drawText(linesAlumno[i], {
                            x: nombrePositionX,
                            y: y - i * lineHeightAlumno,
                            size: fontSizeForAlumno,
                            font: customFontKuenstlerBold,
                            color: rgb(0, 0, 0),
                        });
                    }

                    // Configurar el texto del título del evento
                    fontSizeForEvento = 30;
                    maxWidth = 480
                    y -= 90; // Ajustar la posición Y para el siguiente texto

                    // Distancia entre líneas para el nombre del evento
                    lineHeightEvento = 1.0 * fontSizeForEvento;

                    // Dividir el título del evento si es necesario
                    linesEvento = this.splitTextIntoLines(tituloEvento, maxWidth, customFontBalooBold, fontSizeForEvento);
                    // console.log('linesEvento', linesEvento)

                    for (let i = 0; i < linesEvento.length; i++) {
                        lineWidthEvento = customFontBalooBold.widthOfTextAtSize(linesEvento[i], fontSizeForEvento);
                        // y = y - (i * lineHeightEvento)
                        // y -= (i * lineHeightEvento)
                        const tituloEventoPositionX = (pageWidth - lineWidthEvento) / 2;  // Centrado horizontal

                        // Dibujar el título del evento centrado
                        pagina.drawText(linesEvento[i], {
                            x: tituloEventoPositionX,
                            y: y - i * lineHeightEvento,
                            size: fontSizeForEvento,
                            font: customFontBalooBold,
                            color: rgb(0 / 255, 32 / 255, 58 / 255),
                        });
                    }

                    // Configurar el texto de la fecha del evento
                    fontSizeForFechaEvento = 24;
                    y -= 90 // Ajustar la posición Y para el siguiente texto

                    lineWidthFechaEvento = customFontBalooMedium.widthOfTextAtSize(fechaEvento, fontSizeForFechaEvento);
                    fechaEventoPositionX = (pageWidth - lineWidthFechaEvento) / 2;  // Centrado horizontal

                    // Dibujar la fecha del evento centrado
                    pagina.drawText(fechaEvento, {
                        x: fechaEventoPositionX,
                        y,
                        size: fontSizeForFechaEvento,
                        font: customFontBalooMedium,
                        color: rgb(222 / 255, 148 / 255, 40 / 255),
                    });
                    break
            }

            // Crear nueva página para el logo, código QR y tabla
            const newPageWidth = 842
            const newPageHeight = 590
            const newPage = pdfDoc.addPage([newPageWidth, newPageHeight]);

            // Crear un rectángulo para texto introductorio
            const startX = 20
            const startY = newPage.getHeight() - 170
            const cellWidth = 370
            const cellHeight = 150

            newPage.drawRectangle({
                x: startX,
                y: startY,
                width: cellWidth,
                height: cellHeight,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
                color: rgb(1, 1, 1),
            });

            // Añadir texto a la celda
            let texto = `Esta es una copia auténtica imprimible de un documento electrónico archivado por PerúAgro, `
            texto += `aplicando lo dispuesto por el Art. 25 de D.S. 070-2013-PCM y `
            texto += `la Tercera Disposición Complementaria Final del D.S. 026-2016-PCM.`
            // texto += `Su autenticidad e integridad `
            // texto += `pueden ser contrastadas a través de la siguiente dirección web: `
            // texto += `http://validacion.peruagro.edu.pe`

            newPage.drawText(texto, {
                x: startX + 5,
                y: startY + 135,
                size: 12,
                maxWidth: 370,
                color: rgb(0, 0, 0),
            });

            // Cargar y añadir el logo
            const logoBytes = fs.readFileSync(pathLogo)
            const logoImage = await pdfDoc.embedPng(logoBytes)
            const logoDimensions = logoImage.scale(1.0)

            newPage.drawImage(logoImage, {
                x: newPage.getWidth() - logoDimensions.width - 20,
                y: newPage.getHeight() - logoDimensions.height - 20,
                width: logoDimensions.width,
                height: logoDimensions.height
            })

            const startTemarioX = 20
            const startTemarioY = 310
            const cellWidthTemario = 370
            const cellHeightTemario = 20

            // Dibujar celda para el título del temario
            newPage.drawRectangle({
                x: startTemarioX,
                y: startTemarioY,
                width: cellWidthTemario,
                height: cellHeightTemario,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
                color: rgb(1, 1, 1),
            });

            // Dibujar el título en la celda
            newPage.drawText('Temario', {
                x: startTemarioX + 5,
                y: startTemarioY + 5,
                size: 12,
                color: rgb(0, 0, 0),
            });

            // Ajustar la posición para los ítems del temario
            let currentY = 0

            if (temarioEvento.length > 0) {
                temarioEvento.forEach((item, index) => {
                    if (index == 0) {
                        currentY = startTemarioY - index * (cellHeightTemario + 3)
                    }

                    // Dividir cada ítem del temario
                    const linesItemTemario = this.splitTextIntoLines(item as string, 210, customFontKuenstler, 12);

                    if (linesItemTemario.length > 0) {
                        for (let i = 0; i < linesItemTemario.length; i++) {
                            currentY -= 18

                            newPage.drawText(`${linesItemTemario[i]}`, {
                                x: startTemarioX + 3,
                                y: currentY,
                                size: 12,
                                color: rgb(0, 0, 0)
                            })
                        }
                    }

                    currentY -= 8
                })
            }

            // Crear un rectángulo para la sección del código QR
            let startQRX = 550
            let startQRY = 310
            let cellWidthQR = 240
            let cellHeightQR = 20

            newPage.drawRectangle({
                x: startQRX,
                y: startQRY,
                width: cellWidthQR,
                height: cellHeightQR,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
                color: rgb(1, 1, 1),
            });

            // Dibujar el título en la celda
            newPage.drawText('REGISTRO ELECTRÓNICO', {
                x: startQRX + 5,
                y: startQRY + 5,
                size: 12,
                color: rgb(0, 0, 0),
            });

            // Dibujar nuevo rectángulo para el título de código de validación
            newPage.drawRectangle({
                x: startQRX,
                y: startQRY - 25,
                width: (cellWidthQR / 2),
                height: cellHeightQR,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
                color: rgb(1, 1, 1),
            });

            // Dibujar el título en la celda
            newPage.drawText('Código Validación', {
                x: startQRX + 5,
                y: startQRY - 20,
                size: 12,
                color: rgb(0, 0, 0),
            });

            // Dibujar nuevo rectángulo para el código de validación
            newPage.drawRectangle({
                x: startQRX + (cellWidthQR / 2),
                y: startQRY - 25,
                width: (cellWidthQR / 2),
                height: cellHeightQR,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
                color: rgb(1, 1, 1),
            });

            newPage.drawText(codigo, {
                x: startQRX + (cellWidthQR / 2) + 5,
                y: startQRY - 20,
                size: 12,
                color: rgb(0, 0, 0),
            });

            // Dibujar nuevo rectángulo para el título de verificación
            newPage.drawRectangle({
                x: startQRX,
                y: startQRY - 50,
                width: cellWidthQR,
                height: cellHeightQR,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
                color: rgb(1, 1, 1),
            });

            newPage.drawText('VERIFICACIÓN EN LÍNEA', {
                x: startQRX + 5,
                y: startQRY - 45,
                size: 12,
                color: rgb(0, 0, 0),
            });

            // Dibujar nuevo rectángulo para el código QR
            newPage.drawRectangle({
                x: startQRX,
                y: startQRY - 195,
                width: cellWidthQR,
                height: (cellHeightQR * 7),
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
                color: rgb(1, 1, 1),
            });

            // Determina el ambiente
            const env = process.env.NODE_ENV || 'development'

            // Carga el archivo de configuración correspondiente
            dotenv.config({ path: `.env.${env}` })

            const baseUrl = process.env.CORS_ALLOWED_ORIGIN

            const dataUrlQR = `${baseUrl}/web/certificado/${codigo}`

            let qrCodeImage: PDFImage

            // const qrCodeFilePath = data.codigoQR as string
            let qrCodeFilePath: string = ""

            // Validando si existe el QR
            try {
                if (data.id) {
                    qrCodeFilePath = data.codigoQR as string
                    // Usamos fs.promises.access para evitar bloqueos sincrónicos
                    await fs.promises.access(qrCodeFilePath, fs.constants.F_OK)

                    // Si existe, obtenemos la imagen del QR desde la ruta local
                    const arrayBuffer = await fs.promises.readFile(qrCodeFilePath);
                    qrCodeImage = await pdfDoc.embedPng(arrayBuffer);
                } else {
                    const qrCodeDataUrl = await QRCode.toDataURL(`${dataUrlQR}`)
                    qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl)
                }
            } catch (err) {
                // Generar código QR
                const qrCodeDataUrl = await QRCode.toDataURL(`${dataUrlQR}`)
                qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl)
            }

            const qrCodeDimensions = qrCodeImage.scale(0.8)
            newPage.drawImage(qrCodeImage, {
                x: startQRX + 60,
                y: startQRY - 190,
                width: qrCodeDimensions.width,
                height: qrCodeDimensions.height
            })

            // Guardar el PDF modificado
            const pdfBytes = await pdfDoc.save();
            fs.writeFileSync(outputPath, pdfBytes);

            // Guardar la ruta del QR como imagen
            const qrFileName = `qrcode_${sanitizedAlumno}.png`
            const qrOutputPath = path.resolve(__dirname, `../../public/qrcodes/${sanitizedTitulo}/${qrFileName}`)

            // Verificando que el directorio de salida exista, sino se crea
            const outputDirQRCode = path.dirname(qrOutputPath)

            // Verificamos si el directorio de salida existe
            try {
                await fs.promises.access(outputDirQRCode, fs.constants.F_OK)
            } catch (err) {
                // Si el directorio no existe, se crea
                await fs.promises.mkdir(outputDirQRCode, { recursive: true })
            }

            // Verificamos si el archivo QR existe
            try {
                await fs.promises.access(qrOutputPath, fs.constants.F_OK)
            } catch (err) {
                // Si el archivo no existe, lo generamos
                await QRCode.toFile(qrOutputPath, dataUrlQR);
            }

            // return { outputPath, fileName, codigoQR: qrOutputPath, codigo };
            const dataResult = {
                outputPath,
                fileName,
                codigoQR: qrOutputPath,
                codigo
            }

            return { result: true, message: 'Certificado generado con éxito', dataResult }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage };
        }
    }

    splitTextIntoLines(text: string, maxWidth: number, font: any, fontSize: number) {
        const words = text.split(' '); // Dividir el texto por palabras
        let lines: string[] = [];
        let currentLine = '';

        for (let i = 0; i < words.length; i++) {
            const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
            const width = font.widthOfTextAtSize(testLine, fontSize); // Medir el ancho del texto

            if (width <= maxWidth) {
                currentLine = testLine; // La palabra cabe en la línea actual
            } else {
                if (currentLine) {
                    lines.push(currentLine); // Agregar la línea completa
                }
                currentLine = words[i]; // Iniciar una nueva línea con la palabra actual
            }
        }

        if (currentLine) {
            lines.push(currentLine); // Agregar la última línea
        }

        return lines;
    }
}

export default new CertificadoService() 
