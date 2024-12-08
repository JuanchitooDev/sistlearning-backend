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
                    'fecha_registro',
                    'fecha_descarga',
                    'fecha_envio',
                    'estado',
                    'nombre_alumno_impresion'
                ],
                include: [
                    {
                        model: Alumno,
                        attributes: ['id', 'apellido_paterno', 'apellido_materno', 'nombres']
                    }, {
                        model: Evento,
                        attributes: ['id', 'titulo', 'fecha', 'fecha_fin', 'duracion']
                    }
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
                    'fecha_envio',
                    'estado',
                    'nombre_alumno_impresion'
                ],
                include: [
                    {
                        model: Alumno,
                        attributes: ['id', 'apellido_paterno', 'apellido_materno', 'nombres', 'nombre_capitalized']
                    }, {
                        model: Evento,
                        attributes: ['id', 'titulo', 'fecha', 'fecha_fin', 'duracion']
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
                    'fecha_envio',
                    'estado',
                    'nombre_alumno_impresion'
                ],
                include: [
                    {
                        model: Alumno,
                        attributes: ['id', 'apellido_paterno', 'apellido_materno', 'nombres', 'nombre_capitalized']
                    }, {
                        model: Evento,
                        attributes: ['id', 'titulo', 'fecha', 'fecha_fin', 'duracion']
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
            const templateName = data.templateName as string

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

            const nombreAlumnoImpresion = (data.nombre_alumno_impresion === undefined)
                ? `${alumno.nombre_capitalized}`
                : HString.capitalizeNames(data.nombre_alumno_impresion)

            data.nombre_alumno_impresion = nombreAlumnoImpresion

            // Generar un nuevo archivo PDF
            const { outputPath, fileName, codigoQR, codigo } = await this.generateCertificadoPDF(data, alumno, evento, templateName);

            console.log('nombreAlumnoImpresion', nombreAlumnoImpresion)
            console.log('outputPath', outputPath)
            console.log('fileName', fileName)
            console.log('codigoQR', codigoQR)
            console.log('codigo', codigo)

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
            const templateName = data.templateName as string

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
                const { outputPath, fileName, codigoQR, codigo } = await this.generateCertificadoPDF(data, alumno, evento, templateName);

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
    async generateCertificadoPDF(data: ICertificado, alumno: IAlumno, evento: IEvento, nombreTemplate: string) {
        try {
            console.log('test variables generateCertificadoPDF')
            let codigo = ""
            let fechaFinalStr = ""
            let fechasEvento = []

            const lugar = 'Lambayeque';
            const pathTemplate = path.resolve(__dirname, `../../public/pdf/${nombreTemplate}.pdf`);
            const pathFontKuenstler = path.resolve(__dirname, '../../public/fonts/KUNSTLER.TTF')
            const pathFontKuenstlerBold = path.resolve(__dirname, "../../public/fonts/Kuenstler Script LT Std 2 Bold.otf");
            const pathFontBalooBold = path.resolve(__dirname, '../../public/fonts/BalooChettan2-Bold.ttf')
            const pathFontBalooMedium = path.resolve(__dirname, '../../public/fonts/BalooChettan2-Medium.ttf')
            const pathLogo = path.resolve(__dirname, '../../public/img/logo_transparente_small.png')

            if (!fs.existsSync(pathTemplate)) {
                console.log('aaa')
                return { result: false, message: `No existe la plantilla ${nombreTemplate}` }
            }

            if (!fs.existsSync(pathFontKuenstler)) {
                console.log('bbb')
                return { result: false, message: `No existe fuente KUNSTLER.TTF` }
            }

            if (!fs.existsSync(pathFontKuenstlerBold)) {
                console.log('ccc')
                return { result: false, message: `Kuenstler Script LT Std 2 Bold.otf` }
            }

            if (!fs.existsSync(pathFontBalooBold)) {
                console.log('ddd')
                return { result: false, message: `No existe fuente BalooChettan2-Bold.ttf` }
            }

            if (!fs.existsSync(pathFontBalooMedium)) {
                console.log('eee')
                return { result: false, message: `No existe fuente BalooChettan2-Medium.ttf` }
            }

            if (!fs.existsSync(pathLogo)) {
                console.log('fff')
                return { result: false, message: `No existe el logo` }
            }

            const fechaEvento = HDate.convertDateToString(evento.fecha as Date)
            const temarioEvento = evento.temario?.split('\n') as String[]

            const fechaInicio = toZonedTime(evento.fecha as Date, 'America/Lima')
            const fechaInicioStr = format(fechaInicio, "dd 'de' MMMM 'del' yyyy", { locale: es })

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
                console.log('existe código')
                codigo = data.codigo as string
            } else {
                console.log('generar nuevo código')
                codigo = HString.generateCodigo()
            }

            // Definiendo el nombre del archivo
            const sanitizedTitulo = HString.sanitizeFileName(evento.titulo as string)
            const sanitizedAlumno = HString.sanitizeFileName(alumno.nombre_capitalized as string)
            const fileName = `certificado_${sanitizedAlumno}.pdf`
            const outputPath = path.resolve(__dirname, `../../public/certificados/${sanitizedTitulo}/${fileName}`)

            // Definiendo la fecha de emisión
            const fechaEnvio = toZonedTime(data.fecha_envio as Date, 'America/Lima')

            const fechaEmision = format(fechaEnvio, "dd 'de' MMMM 'del' yyyy", { locale: es })
            const lugarFechaEmision = `${lugar}, ${fechaEmision}`

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
            let maxWidth = 0
            let fontSizeForEvento = 0
            let fontSizeForFechaEvento = 0
            let fontSizeForFechaEmision = 0
            let lineHeight = 0
            let lines = []
            let lineWidth = 0
            let posX = 0

            // Obtener el ancho de la página
            const pageWidth = pagina.getWidth();

            const nombreImpresion = data.nombre_alumno_impresion as string;

            console.log('nombreImpresion', nombreImpresion, 'nombreTemplate', nombreTemplate)

            switch (nombreTemplate) {
                case "template":
                    // Configurar el texto (posición y estilo)
                    fontSizeForAlumno = 60;
                    y = 270; // posición Y
                    maxWidth = 500; // Ancho máximo disponible para el texto

                    // Calcular el ancho de cada línea de texto
                    lineHeight = 0.8 * fontSizeForAlumno; // Distancia entre líneas

                    // Dividir el nombre del alumno en líneas
                    lines = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForAlumno);

                    if (lines.length > 1) {
                        y = y + 30
                        fontSizeForAlumno = 54
                    }

                    for (let i = 0; i < lines.length; i++) {
                        lineWidth = customFontKuenstlerBold.widthOfTextAtSize(lines[i], fontSizeForAlumno);
                        const x = ((pageWidth - lineWidth) / 2) + 140;

                        pagina.drawText(lines[i], {
                            x,
                            y: y - i * lineHeight, // Ajustar la posición vertical para cada línea
                            size: fontSizeForAlumno,
                            font: customFontKuenstlerBold,
                            color: rgb(0, 0, 0), // Negro
                        });
                    }

                    fontSizeForEvento = 16
                    fontSizeForFechaEvento = 12
                    fontSizeForFechaEmision = 13

                    let x = 250
                    x = x + 60

                    y = 206

                    // Añadir el título del evento
                    pagina.drawText(evento.titulo as string, {
                        x,
                        y,
                        size: fontSizeForEvento,
                        font: customFontBalooBold,
                        color: rgb(4 / 255, 45 / 255, 71 / 255)
                    });

                    x = x + 123
                    y = y - 36

                    // Añadir la fecha del evento
                    pagina.drawText(fechaEvento, {
                        x,
                        y,
                        size: fontSizeForFechaEvento,
                        font: customFontBalooMedium,
                        color: rgb(4 / 255, 45 / 255, 71 / 255)
                    });

                    x = x + 120
                    y = y - 50

                    // Añadir la fecha del evento
                    pagina.drawText(lugarFechaEmision, {
                        x,
                        y,
                        size: fontSizeForFechaEmision,
                        font: customFontBalooMedium,
                        color: rgb(4 / 255, 45 / 255, 71 / 255)
                    });
                    break;
                case "template_dos":
                    fontSizeForAlumno = 48;
                    fontSizeForEvento = 24
                    fontSizeForFechaEvento = 24

                    y = 350; // posición Y
                    maxWidth = 550; // Ancho máximo disponible para el texto
                    lineWidth = customFontKuenstlerBold.widthOfTextAtSize(nombreImpresion, fontSizeForAlumno)
                    if (lineWidth > maxWidth) {
                        fontSizeForAlumno = 46
                    }

                    posX = 80
                    pagina.drawText(nombreImpresion, {
                        x: posX,
                        y, // Ajustar la posición vertical para cada línea
                        size: fontSizeForAlumno,
                        font: customFontKuenstlerBold,
                        color: rgb(0, 0, 0), // Negro
                    });

                    // Calcular el ancho de cada línea de texto
                    lineHeight = 1.2 * fontSizeForEvento; // Distancia entre líneas

                    // Dividir el nombre del alumno en líneas
                    lines = this.splitTextIntoLines(evento.titulo as string, maxWidth, customFontBalooBold, fontSizeForEvento);
                    y = y - 30

                    if (lines.length > 1) {
                        y = y - 40
                    }

                    for (let i = 0; i < lines.length; i++) {
                        const lineWidth = customFontBalooBold.widthOfTextAtSize(lines[i], fontSizeForEvento)
                        const x = ((pageWidth - lineWidth) / 2) - 80

                        pagina.drawText(lines[i], {
                            x,
                            y: y - i * lineHeight, // Ajustar la posición vertical para cada línea
                            size: fontSizeForEvento,
                            font: customFontBalooBold,
                            color: rgb(19 / 255, 37 / 255, 60 / 255),
                        });
                    }

                    if (fechasEvento.length > 1) {
                        y = y - 60
                    } else {
                        y = y - 70
                    }

                    for (let i = 0; i < fechasEvento.length; i++) {
                        const lineWidth = customFontBalooBold.widthOfTextAtSize(fechasEvento[i], fontSizeForFechaEvento)
                        const x = ((pageWidth - lineWidth) / 2) - 80

                        pagina.drawText(fechasEvento[i], {
                            x,
                            y: y - i * lineHeight, // Ajustar la posición vertical para cada línea
                            size: fontSizeForFechaEvento,
                            font: customFontBalooMedium,
                            color: rgb(38 / 255, 69 / 255, 100 / 255),
                        });
                    }

                    break;
                case "template_tres":
                    fontSizeForAlumno = 48;
                    fontSizeForEvento = 24
                    fontSizeForFechaEvento = 24

                    y = 310; // posición Y
                    maxWidth = 550; // Ancho máximo disponible para el texto
                    lineWidth = customFontKuenstlerBold.widthOfTextAtSize(nombreImpresion, fontSizeForAlumno)
                    if (lineWidth > maxWidth) {
                        fontSizeForAlumno = 46
                    }

                    posX = 80
                    pagina.drawText(nombreImpresion, {
                        x: posX,
                        y, // Ajustar la posición vertical para cada línea
                        size: fontSizeForAlumno,
                        font: customFontKuenstlerBold,
                        color: rgb(0, 0, 0), // Negro
                    });

                    // Calcular el ancho de cada línea de texto
                    lineHeight = 1.2 * fontSizeForEvento; // Distancia entre líneas

                    // Dividir el nombre del alumno en líneas
                    lines = this.splitTextIntoLines(evento.titulo as string, maxWidth, customFontBalooBold, fontSizeForEvento);
                    y = y - 30

                    if (lines.length > 1) {
                        y = y - 40
                    }

                    for (let i = 0; i < lines.length; i++) {
                        const lineWidth = customFontBalooBold.widthOfTextAtSize(lines[i], fontSizeForEvento)
                        const x = ((pageWidth - lineWidth) / 2) - 80

                        pagina.drawText(lines[i], {
                            x,
                            y: y - i * lineHeight, // Ajustar la posición vertical para cada línea
                            size: fontSizeForEvento,
                            font: customFontBalooBold,
                            color: rgb(19 / 255, 37 / 255, 60 / 255),
                        });
                    }

                    if (fechasEvento.length > 1) {
                        y = y - 60
                    } else {
                        y = y - 70
                    }

                    for (let i = 0; i < fechasEvento.length; i++) {
                        const lineWidth = customFontBalooBold.widthOfTextAtSize(fechasEvento[i], fontSizeForFechaEvento)
                        const x = ((pageWidth - lineWidth) / 2) - 80

                        pagina.drawText(fechasEvento[i], {
                            x,
                            y: y - i * lineHeight, // Ajustar la posición vertical para cada línea
                            size: fontSizeForFechaEvento,
                            font: customFontBalooMedium,
                            color: rgb(38 / 255, 69 / 255, 100 / 255),
                        });
                    }

                    break;
            }

            console.log('newPage')

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

            console.log('agregar logo')

            // Cargar y añadir el logo
            const logoBytes = fs.readFileSync(pathLogo)
            const logoImage = await pdfDoc.embedPng(logoBytes)
            const logoDimensions = logoImage.scale(1.0)

            console.log('add logoImage')
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

            console.log('add titulo temario')
            // Dibujar el título en la celda
            newPage.drawText('Temario', {
                x: startTemarioX + 5,
                y: startTemarioY + 5,
                size: 12,
                color: rgb(0, 0, 0),
            });

            // Ajustar la posición para los ítems del temario
            let currentY = 0

            console.log('temarioEvento', temarioEvento)

            temarioEvento.forEach((item, index) => {
                if (index == 0) {
                    currentY = startTemarioY - index * (cellHeightTemario + 3)
                }

                // Dividir cada ítem del temario
                const linesItemTemario = this.splitTextIntoLines(item as string, 210, customFontKuenstler, 12);
                for (let i = 0; i < linesItemTemario.length; i++) {
                    currentY -= 18

                    newPage.drawText(`${linesItemTemario[i]}`, {
                        x: startTemarioX + 3,
                        y: currentY,
                        size: 12,
                        color: rgb(0, 0, 0)
                    })
                }

                currentY -= 8
            })

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

            console.log('add título registro electrónico')
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

            console.log('add título código validación')
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

            console.log('add código')
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

            console.log('load .env')

            // Determina el ambiente
            const env = process.env.NODE_ENV || 'development'

            // Carga el archivo de configuración correspondiente
            dotenv.config({ path: `.env.${env}` })

            const baseUrl = process.env.CORS_ALLOWED_ORIGIN

            const dataUrlQR = `${baseUrl}/certificado/${codigo}`

            let qrCodeImage: PDFImage

            // const qrCodeFilePath = data.codigoQR as string
            let qrCodeFilePath: string = ""

            console.log('env', env)
            console.log('baseUrl', baseUrl)
            console.log('dataUrlQR', dataUrlQR)
            // console.log('qrCodeFilePath', qrCodeFilePath)

            // Validando si existe el QR
            try {
                if (data.id) {
                    console.log('existe código QR')
                    qrCodeFilePath = data.codigoQR as string
                    // Usamos fs.promises.access para evitar bloqueos sincrónicos
                    await fs.promises.access(qrCodeFilePath, fs.constants.F_OK)

                    // Si existe, obtenemos la imagen del QR desde la ruta local
                    const arrayBuffer = await fs.promises.readFile(qrCodeFilePath);
                    qrCodeImage = await pdfDoc.embedPng(arrayBuffer);
                } else {
                    console.log('no existe código qr')
                    const qrCodeDataUrl = await QRCode.toDataURL(`${dataUrlQR}`)
                    qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl)
                }
            } catch (err) {
                console.log('generar nuevo códigp err')
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

            console.log('qrFileName', qrFileName)
            console.log('qrOutputPath', qrOutputPath)
            console.log('outputDirQRCode', outputDirQRCode)

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

            return { outputPath, fileName, codigoQR: qrOutputPath, codigo };
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
