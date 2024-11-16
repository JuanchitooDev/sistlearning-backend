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
import xml2js from 'xml2js'
import sharp from 'sharp'

class CertificadoService {

    async getCertificados(): Promise<CertificadoResponse> {
        try {
            const certificados = await Certificado.findAll({
                attributes: [
                    'id', 'id_alumno', 'id_evento', 'codigo', 'codigoQR', 'ruta', 'fileName', 'fecha_registro', 'fecha_descarga', 'fecha_envio', 'estado', 'nombre_alumno_impresion'
                ],
                include: [
                    {
                        model: Alumno,
                        attributes: ['id', 'apellido_paterno', 'apellido_materno', 'nombres']
                    }, {
                        model: Evento,
                        attributes: ['id', 'titulo']
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
                    'id', 'id_alumno', 'id_evento', 'codigo', 'codigoQR', 'ruta', 'fileName', 'fecha_registro', 'fecha_descarga', 'fecha_envio', 'estado', 'nombre_alumno_impresion'
                ],
                include: [
                    {
                        model: Alumno,
                        attributes: ['id', 'apellido_paterno', 'apellido_materno', 'nombres', 'nombre_capitalized']
                    }, {
                        model: Evento,
                        attributes: ['id', 'titulo']
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
                    'id', 'id_alumno', 'id_evento', 'codigo', 'codigoQR', 'ruta', 'fileName', 'fecha_registro', 'fecha_descarga', 'fecha_envio', 'estado', 'nombre_alumno_impresion'
                ],
                include: [
                    {
                        model: Alumno,
                        attributes: ['id', 'apellido_paterno', 'apellido_materno', 'nombres', 'nombre_capitalized']
                    }, {
                        model: Evento,
                        attributes: ['id', 'titulo']
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

            const nombreAlumnoImpresion = (data.nombre_alumno_impresion === undefined)
                ? `${alumno.nombre_capitalized}`
                : HString.capitalizeNames(data.nombre_alumno_impresion)

            data.nombre_alumno_impresion = nombreAlumnoImpresion

            // Generar un nuevo archivo PDF
            const { outputPath, fileName, codigoQR, codigo } = await this.generateCertificadoPDF(data, alumno, evento);

            data.fecha_envio = fechaEnvio
            data.fecha_registro = new Date()
            data.ruta = outputPath
            data.fileName = fileName
            data.codigoQR = codigoQR
            data.codigo = codigo

            /*
            const svgPath = path.resolve(__dirname, '..', '..', 'public', 'img', 'template2.svg');

            const svgData = fs.readFileSync(svgPath, 'utf-8');

            const nombreAlumno = (data.nombre_alumno_impresion === undefined)
                ? `${alumno.nombre_capitalized}`
                : HString.capitalizeNames(data.nombre_alumno_impresion)

            // Modificar el SVG con el nombre del participante
            const modifiedSvg = await this.modificarSvg(svgData, nombreAlumno);

            // Asegúrate de que el valor es un string antes de convertirlo a un buffer
            const svgBuffer = Buffer.from(modifiedSvg, 'utf-8');

            // Convertir el SVG a PNG con sharp
            const pngBuffer = await sharp(svgBuffer)
                .png()  // Convertir a PNG
                .toBuffer();

            const { pathFileName, fileName, pathCodigoQR, codigo } = await this.generatePdfFromSvg(pngBuffer, alumno, evento)

            data.fecha_envio = fechaEnvio
            data.fecha_registro = new Date()
            data.ruta = pathFileName
            data.fileName = fileName
            data.codigoQR = pathCodigoQR
            data.codigo = codigo
            */

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

            console.log('data updateCertificado', data)
            console.log('certificado updateCertificado', certificado)

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

                // const nombreAlumnoImpresion = (data.nombre_alumno_impresion === undefined)
                //     ? `${alumno.nombre_capitalized}`
                //     : data.nombre_alumno_impresion

                const nombreAlumnoImpresion = (data.nombre_alumno_impresion === undefined)
                    ? `${alumno.nombre_capitalized}`
                    : HString.capitalizeNames(data.nombre_alumno_impresion)

                data.id = certificado.id
                data.codigo = certificado.codigo
                data.codigoQR = certificado.codigoQR
                data.ruta = certificado.ruta
                data.nombre_alumno_impresion = nombreAlumnoImpresion

                // Generar un nuevo archivo PDF
                const { outputPath, fileName, codigoQR, codigo } = await this.generateCertificadoPDF(data, alumno, evento);

                // Actualizar la base de datos con la nueva ruta y los nuevos datos
                data.ruta = outputPath;
                data.fileName = fileName;
                data.codigoQR = codigoQR;
                data.codigo = codigo;
                data.fecha_envio = fechaEnvio

                console.log('ruta', outputPath, 'fileName', fileName, 'codigoQR', codigoQR, 'codigo', codigo, 'fechaEnvio', fechaEnvio)

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
            console.log('errorMessage updateCertificado', errorMessage)
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
            const lugar = 'Lambayeque';
            const pathTemplate = path.resolve(__dirname, '../../public/pdf/template.pdf');
            const pathFontKuenstler = path.resolve(__dirname, '../../public/fonts/Kuenstler Script LT Std 2 Bold.otf');
            const pathFontBalooBold = path.resolve(__dirname, '../../public/fonts/BalooChettan2-Bold.ttf')
            const pathFontBalooMedium = path.resolve(__dirname, '../../public/fonts/BalooChettan2-Medium.ttf')
            const pathLogo = path.resolve(__dirname, '../../public/img/logo_small.png');

            const fechaEvento = HDate.convertDateToString(evento.fecha as Date)
            const temarioEvento = evento.temario?.split('\n') as String[]

            // Código del certificado
            if (data.id) {
                codigo = data.codigo as string
            } else {
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
            const fontKuenstlerBytes = fs.readFileSync(pathFontKuenstler)
            const customFontKuenstler = await pdfDoc.embedFont(fontKuenstlerBytes)

            // Cargar otra fuentes
            const fontBalooBold = fs.readFileSync(pathFontBalooBold)
            const customFontBalooBold = await pdfDoc.embedFont(fontBalooBold)

            const fontBalooMedium = fs.readFileSync(pathFontBalooMedium)
            const customFontBalooMedium = await pdfDoc.embedFont(fontBalooMedium)

            // Obtener la primera página
            const pagina = pdfDoc.getPage(0);

            // Configurar el texto (posición y estilo)
            let fontSizeForAlumno = 60;
            // let x = 280; // posición X
            let y = 270; // posición Y
            const maxWidth = 500; // Ancho máximo disponible para el texto

            const name = data.nombre_alumno_impresion as string;

            // Calcular el ancho de cada línea de texto
            const lineHeight = 0.8 * fontSizeForAlumno; // Distancia entre líneas

            // Dividir el nombre del alumno en líneas
            const lines = this.splitTextIntoLines(name, maxWidth, customFontKuenstler, fontSizeForAlumno);

            // Obtener el ancho de la página
            const pageWidth = pagina.getWidth();

            if (lines.length > 1) {
                y = y + 30
                fontSizeForAlumno = 54
            }

            // Añadir el nombre del alumno
            // pagina.drawText(data.nombre_alumno_impresion as string, {
            //     x,
            //     y,
            //     size: fontSizeForAlumno,
            //     font: customFontKuenstler,
            //     color: rgb(0, 0, 0), // negro
            // });
            for (let i = 0; i < lines.length; i++) {
                const lineWidth = customFontKuenstler.widthOfTextAtSize(lines[i], fontSizeForAlumno);
                const x = ((pageWidth - lineWidth) / 2) + 140;
                console.log('lineWidth', lineWidth, 'pageWidth', pageWidth, 'x', x, 'newY', (y - i * lineHeight))

                pagina.drawText(lines[i], {
                    x,
                    y: y - i * lineHeight, // Ajustar la posición vertical para cada línea
                    size: fontSizeForAlumno,
                    font: customFontKuenstler,
                    color: rgb(0, 0, 0), // Negro
                });
            }

            const fontSizeForEvento = 16
            const fontSizeForFecha = 13

            let x = 250
            x = x + 60

            // y = 290
            // y = y - 54
            y = 206

            // Añadir el título del evento
            pagina.drawText(evento.titulo as string, {
                x,
                y,
                size: fontSizeForEvento,
                font: customFontBalooBold,
                color: rgb(4 / 255, 45 / 255, 71 / 255)
            });

            x = x + 125
            y = y - 36

            // Añadir la fecha del evento
            pagina.drawText(fechaEvento, {
                x,
                y,
                size: fontSizeForFecha,
                font: customFontBalooMedium,
                color: rgb(4 / 255, 45 / 255, 71 / 255)
            });

            x = x + 120
            // y2 = 50
            y = y - 50

            // Añadir la fecha del evento
            pagina.drawText(lugarFechaEmision, {
                x,
                y,
                size: fontSizeForFecha,
                font: customFontBalooMedium,
                color: rgb(4 / 255, 45 / 255, 71 / 255)
            });

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
                maxWidth: cellWidth,
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
            const startTemarioY = 290
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
            const itemsStartY = startTemarioY - (cellHeightTemario + 3);

            temarioEvento.forEach((item, index) => {
                const currentY = itemsStartY - index * (cellHeightTemario + 3)

                // Dibujar las celdas
                newPage.drawRectangle({
                    x: startTemarioX,
                    y: currentY,
                    width: cellWidthTemario,
                    height: cellHeightTemario,
                    borderColor: rgb(0, 0, 0),
                    borderWidth: 0,
                    color: rgb(1, 1, 1)
                })

                // Dibujar el texto en las celdas
                newPage.drawText(`${index + 1}. ${item}`, {
                    x: startTemarioX + 3,
                    y: currentY + 3,
                    size: 12,
                    color: rgb(0, 0, 0)
                })
            })

            // Crear un rectángulo para la sección del código QR
            let startQRX = 550
            let startQRY = 290
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

            console.log('env', env)
            console.log('baseUrl', baseUrl)

            const dataUrlQR = `${baseUrl}/certificado/${codigo}`

            let qrCodeImage: PDFImage

            const qrCodeFilePath = data.codigoQR as string

            // Validando si existe el QR
            try {
                // Usamos fs.promises.access para evitar bloqueos sincrónicos
                await fs.promises.access(qrCodeFilePath, fs.constants.F_OK)

                // Si existe, obtenemos la imagen del QR desde la ruta local
                const arrayBuffer = await fs.promises.readFile(qrCodeFilePath);
                qrCodeImage = await pdfDoc.embedPng(arrayBuffer);
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

            // // Verificando que el directorio de salida exista, sino se crea
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
                console.log(`El archivo QR ya existe en: ${qrOutputPath}`);
            } catch (err) {
                // Si el archivo no existe, lo generamos
                console.log(`Generando nuevo código QR en: ${qrOutputPath}`);
                await QRCode.toFile(qrOutputPath, dataUrlQR);
                console.log(`Código QR guardado en: ${qrOutputPath}`);
            }

            // if (!fs.existsSync(outputDirQRCode)) {
            //     fs.mkdirSync(outputDirQRCode, { recursive: true })
            // }

            // await QRCode.toFile(qrOutputPath, `${dataUrlQR}`)

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

    // Función para modificar el SVG
    async modificarSvg(svgData: any, nombre: String): Promise<string> {
        return new Promise((resolve, reject) => {

            const parseOptions = {
                explicitArray: false, // Esto hará que los elementos únicos no se conviertan en arrays.
                normalizeTags: true,  // Asegura que las etiquetas sean tratadas en minúsculas (por ejemplo, <text> en lugar de <Text>)
                mergeAttrs: true      // Fusiona los atributos, si es necesario
            };

            // Eliminar el espacio de nombres 'xmlns:i' si no es necesario
            // Esto reemplaza cualquier instancia del namespace 'xmlns:i' en el SVG
            // svgData = svgData.replace(/xmlns:i="[^"]*"/g, "");

            // Agregar el espacio de nombres xmlns:xlink si no existe
            // if (!svgData.includes('xmlns:xlink')) {
            //     svgData = svgData.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
            // }

            // Parsear al SVG para cambiar el contenido
            xml2js.parseString(svgData, parseOptions, (err, result) => {
                if (err) {
                    console.log('Error al parsear SVG: ', err)
                    return reject(err)
                }

                // Buscar el elemento <tspan> con id="participante"
                const textElements = result.svg.g['g'].text;  // Asumiendo que result.svg.g['g'].text tiene los elementos <text>

                // Si el elemento 'text' no es un array, hacerlo un array
                const textArray = Array.isArray(textElements) ? textElements : [textElements];

                // Reemplazar el texto del <tspan> con id="participante"
                textArray.forEach((textElement: any) => {
                    const tspan = textElement.tspan;
                    if (Array.isArray(tspan)) {
                        tspan.forEach((tspanElement: any) => {
                            if (tspanElement.$ && tspanElement.$.id === 'participante') {
                                tspanElement._ = nombre;  // Reemplazar el contenido de <tspan>
                            }
                        });
                    } else {
                        if (tspan.id !== undefined && tspan.id === 'participante') {
                            tspan._ = nombre;  // Reemplazar el contenido de <tspan>
                        }
                    }
                });

                // Convertir el objeto XML modificado de nuevo a cadena
                const builder = new xml2js.Builder()
                const modifiedSvg: string = builder.buildObject(result)

                resolve(modifiedSvg)
            })
        })
    }

    // Función para generar el PDF a partir del SVG modificado
    async generatePdfFromSvg(svgData: any, alumno: IAlumno, evento: IEvento) {
        try {
            const pathLogo = path.resolve(__dirname, '../../public/img/logo_small.png');

            // Código del certificado
            const codigo = HString.generateCodigo()

            // Definiendo el nombre del archivo
            const sanitizedTitulo = HString.sanitizeFileName(evento.titulo as string)
            const sanitizedAlumno = HString.sanitizeFileName(alumno.nombre_capitalized as string)
            const fileName = `certificado_${sanitizedAlumno}.pdf`
            const outputPath = path.resolve(__dirname, `../../public/certificados/${sanitizedTitulo}/${fileName}`)

            const temarioEvento = evento.temario?.split('\n') as String[]

            // Verificando que el directorio de salida exista, sino se crea
            const outputDir = path.dirname(outputPath)
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true })
            }

            const pdfDoc = await PDFDocument.create();

            // Crear una página en formato horizontal (landscape)
            const page = pdfDoc.addPage([842, 595]); // A4 en formato landscape (842x595 puntos)

            // Convertir el SVG modificado a una imagen PNG
            const svgBuffer = Buffer.from(svgData);

            const img = await pdfDoc.embedPng(svgBuffer);

            // Dibujar la imagen en el PDF (ajustado al tamaño de la página)
            const pageWidth = page.getWidth();
            const pageHeight = page.getHeight();

            page.drawImage(img, {
                x: 0,
                y: 0,
                width: pageWidth,
                height: pageHeight,
            });

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
                maxWidth: cellWidth,
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
            const startTemarioY = 290
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
            const itemsStartY = startTemarioY - (cellHeightTemario + 3);

            temarioEvento.forEach((item, index) => {
                const currentY = itemsStartY - index * (cellHeightTemario + 3)

                // Dibujar las celdas
                newPage.drawRectangle({
                    x: startTemarioX,
                    y: currentY,
                    width: cellWidthTemario,
                    height: cellHeightTemario,
                    borderColor: rgb(0, 0, 0),
                    borderWidth: 0,
                    color: rgb(1, 1, 1)
                })

                // Dibujar el texto en las celdas
                newPage.drawText(`${index + 1}. ${item}`, {
                    x: startTemarioX + 3,
                    y: currentY + 3,
                    size: 12,
                    color: rgb(0, 0, 0)
                })
            })

            // Crear un rectángulo para la sección del código QR
            let startQRX = 550
            let startQRY = 290
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

            // Generar código QR
            const dataUrl = `${baseUrl}/certificado/${codigo}`
            const qrCodeDataUrl = await QRCode.toDataURL(`${dataUrl}`)
            const qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl)
            const qrCodeDimensions = qrCodeImage.scale(0.8)
            newPage.drawImage(qrCodeImage, {
                x: startQRX + 60,
                y: startQRY - 190,
                width: qrCodeDimensions.width,
                height: qrCodeDimensions.height
            })

            // // Guardar el PDF y devolverlo como un buffer
            const pdfBytes = await pdfDoc.save();
            fs.writeFileSync(outputPath, pdfBytes);

            // Guardar la ruta del QR como imagen
            const qrFileName = `qrcode_${sanitizedAlumno}.png`
            const qrOutputPath = path.resolve(__dirname, `../../public/qrcodes/${sanitizedTitulo}/${qrFileName}`)

            // Verificando que el directorio de salida exista, sino se crea
            const outputDirQRCode = path.dirname(qrOutputPath)
            if (!fs.existsSync(outputDirQRCode)) {
                fs.mkdirSync(outputDirQRCode, { recursive: true })
            }

            await QRCode.toFile(qrOutputPath, `${dataUrl}`)

            return {
                pathFileName: outputPath,
                fileName: fileName,
                pathCodigoQR: qrOutputPath,
                codigo: codigo
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }
}

export default new CertificadoService() 
