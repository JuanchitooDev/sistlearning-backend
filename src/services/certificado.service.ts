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
import { PDFDocument, rgb } from 'pdf-lib'
import fs from 'fs';
import path from 'path';
import fontkit from 'fontkit';
import QRCode from 'qrcode'

class CertificadoService {
    async getCertificados(): Promise<CertificadoResponse> {
        try {
            const certificados = await Certificado.findAll({
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
            // const msg = `Error al obtener los certificados: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async getCertificadoById(id: number): Promise<CertificadoResponse> {
        try {
            const certificado = await Certificado.findByPk(id, {
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
            if (!certificado) {
                return { result: false, error: 'Certificado no encontrado' }
            }
            return { result: true, data: certificado }
        } catch (error) {
            // const msg = `Error al obtener el certificado: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async getCertificadoByCodigo(codigo: string): Promise<CertificadoResponse> {
        try {
            const certificado = await Certificado.findOne({
                where: { codigo },
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
            if (!certificado) {
                return { result: false, error: 'Certificado no encontrado' }
            }
            return { result: true, data: certificado }
        } catch (error) {
            // const msg = `Error al obtener el certificado: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async downloadCertificado(id: number) {
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
            return { result: false, message: responseCertificado.error, outputPath: null, fileName: null }
        }
    }

    async createCertificado(data: ICertificado): Promise<CertificadoResponse> {
        try {
            const { id_alumno, id_evento } = data

            // Definiendo rutas de template del certificado, fuentes y logo
            const pathTemplate = path.resolve(__dirname, '../../public/pdf/template.pdf')
            const pathFontKuenstler = path.resolve(__dirname, '../../public/fonts/Kuenstler Script LT Std 2 Bold.otf')
            const pathFontBalooBold = path.resolve(__dirname, '../../public/fonts/BalooChettan2-Bold.ttf')
            const pathFontBalooMedium = path.resolve(__dirname, '../../public/fonts/BalooChettan2-Medium.ttf')
            const pathLogo = path.resolve(__dirname, '../../public/img/logo_small.png')

            // Obteniendo el alumno
            const alumnoResponse = await AlumnoService.getAlumnoById(id_alumno as number)
            if (!alumnoResponse.result) {
                return { result: false, error: alumnoResponse.error }
            }
            const alumno = alumnoResponse.data as IAlumno
            const nombreCompleto = `${alumno.nombres} ${alumno.apellido_paterno} ${alumno.apellido_materno}`

            // Obteniendo el evento
            const eventoResponse = await EventoService.getEventoById(id_evento as number)
            if (!eventoResponse.result) {
                return { result: false, error: eventoResponse.error }
            }
            const evento = eventoResponse.data as IEvento
            const tituloEvento = evento.titulo as string
            const fechaEvento = HDate.convertDateToString(evento.fecha as Date)
            const temarioEvento = evento.temario?.split('\n') as String[]

            // Código del certificado
            const codigo = HString.generateCodigo()

            // Definiendo el nombre del archivo
            const sanitizedTitulo = HString.sanitizeFileName(tituloEvento)
            const sanitizedAlumno = HString.sanitizeFileName(nombreCompleto)
            const fileName = `certificado_${sanitizedAlumno}.pdf`
            const outputPath = path.resolve(__dirname, `../../public/certificados/${sanitizedTitulo}/${fileName}`)

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
            const fontSizeForAlumno = 62;
            let x = 290; // posición X
            let y = 260; // posición Y

            // Añadir el nombre del alumno
            pagina.drawText(nombreCompleto, {
                x,
                y,
                size: fontSizeForAlumno,
                font: customFontKuenstler,
                color: rgb(0, 0, 0), // negro
            });

            const fontSizeForEvento = 16
            const fontSizeForFecha = 14

            x = x + 73
            y = y - 54

            // Añadir el título del evento
            pagina.drawText(tituloEvento, {
                x,
                y,
                size: fontSizeForEvento,
                font: customFontBalooBold,
                color: rgb(4 / 255, 45 / 255, 71 / 255)
            });

            x = x + 74
            y = y - 36

            // Añadir la fecha del evento
            pagina.drawText(fechaEvento, {
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
            texto += `la Tercera Disposición Complementaria Final del D.S. 026-2016-PCM. Su autenticidad e integridad `
            texto += `pueden ser contrastadas a través de la siguiente dirección web: `
            texto += `http://validacion.peruagro.edu.pe`

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
                    borderWidth: 1,
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
                y: startQRY - 175,
                width: cellWidthQR,
                height: (cellHeightQR * 6),
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
                color: rgb(1, 1, 1),
            });

            // Generar código QR
            const dataUrl = `https://sistlearning-web.onrender.com/certificado/${codigo}`
            const qrCodeDataUrl = await QRCode.toDataURL(`${dataUrl}`)
            const qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl)
            const qrCodeDimensions = qrCodeImage.scale(0.8)
            newPage.drawImage(qrCodeImage, {
                x: startQRX + 80,
                y: startQRY - 175,
                width: qrCodeDimensions.width,
                height: qrCodeDimensions.height
            })

            // -------------------------

            // // Cargar y añadir el logo
            // const logoBytes = fs.readFileSync(pathLogo)
            // const logoImage = await pdfDoc.embedPng(logoBytes)
            // const logoDimensions = logoImage.scale(1.0)
            // newPage.drawImage(logoImage, {
            //     x: 20,
            //     y: newPage.getHeight() - logoDimensions.height - 20,
            //     width: logoDimensions.width,
            //     height: logoDimensions.height
            // })

            // // Generar código QR
            // const qrCodeDataUrl = await QRCode.toDataURL(`Alumno: ${nombreCompleto}`)
            // const qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl)
            // const qrCodeDimensions = qrCodeImage.scale(0.8)
            // newPage.drawImage(qrCodeImage, {
            //     x: newPage.getWidth() - qrCodeDimensions.width - 20,
            //     y: newPage.getHeight() - qrCodeDimensions.height - 20,
            //     width: qrCodeDimensions.width,
            //     height: qrCodeDimensions.height
            // })

            // // Añadir una tabla simple con el temario
            // const temario = [
            //     { tema: 'TAXONOMÍA Y ORIGEN DE ARÁNDANOS' },
            //     { tema: 'COMPOSICIÓN NUTRICIONAL DEL ARÁNDANO' },
            //     { tema: 'MANEJO AGRONÓMICO' },
            //     { tema: 'FERTILIZACIÓN Y MANEJO DE ABONOS DE ARÁNDANOS' }
            // ]

            // const startX = 20
            // const startY = 250
            // const cellWidth = 370
            // const cellHeight = 20

            // // Dibujar celda para el título
            // newPage.drawRectangle({
            //     x: startX,
            //     y: startY,
            //     width: cellWidth,
            //     height: cellHeight,
            //     borderColor: rgb(0, 0, 0),
            //     borderWidth: 1,
            //     color: rgb(1, 1, 1),
            // });

            // // Dibujar el título en la celda
            // newPage.drawText('Temario', {
            //     x: startX + 5,
            //     y: startY + 5,
            //     size: 12,
            //     color: rgb(0, 0, 0),
            // });

            // // Ajustar la posición para los ítems del temario
            // const itemsStartY = startY - (cellHeight + 5);

            // temario.forEach((item, index) => {
            //     const currentY = itemsStartY - index * (cellHeight + 5)

            //     // Dibujar las celdas
            //     newPage.drawRectangle({
            //         x: startX,
            //         y: currentY,
            //         width: cellWidth,
            //         height: cellHeight,
            //         borderColor: rgb(0, 0, 0),
            //         borderWidth: 1,
            //         color: rgb(1, 1, 1)
            //     })

            //     // Dibujar el texto en las celdas
            //     newPage.drawText(`${index + 1}. ${item.tema}`, {
            //         x: startX + 5,
            //         y: currentY + 5,
            //         size: 12,
            //         color: rgb(0, 0, 0)
            //     })
            // })

            // Guardar el PDF modificado
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

            data.ruta = outputPath
            data.fileName = fileName
            data.codigoQR = qrOutputPath
            data.codigo = codigo
            data.fecha_registro = new Date()

            const newCertificado = await Certificado.create(data as any)
            return { result: true, data: newCertificado }
        } catch (error) {
            // const msg = `Error al crear el certificado: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async updateCertificado(id: number, data: ICertificado): Promise<CertificadoResponse> {
        try {
            const certificado = await Certificado.findByPk(id)
            if (!certificado) {
                return { result: false, error: 'Certificado no encontrado' }
            }
            const updatedCertificado = await certificado.update(data)
            return { result: true, data: updatedCertificado }
        } catch (error) {
            // const msg = `Error al actualizar el certificado: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg }
        }
    }

    async deleteCertificado(id: number): Promise<CertificadoResponse> {
        try {
            const certificado = await Certificado.findByPk(id);
            if (!certificado) {
                return { result: false, error: 'Certificado no encontrado' };
            }
            await certificado.destroy();
            return { result: true, data: { id } };
        } catch (error) {
            // const msg = `Error al eliminar el certificado: ${error.message}`
            const msg = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: msg };
        }
    }
}

export default new CertificadoService() 
