import { IAlumno } from "../interfaces/alumnoInterface";
import { ICertificado } from "../interfaces/certificadoInterface";
import { IEvento } from "../interfaces/eventoInterface";
import path from "path";
import fs from 'fs';
import HDate from "./HDate";
import { toZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import HString from "./HString";
import { es } from 'date-fns/locale';
import { PDFDocument, PDFImage, rgb } from "pdf-lib";
import fontkit from 'fontkit';
import QRCode from 'qrcode';
import dotenv from 'dotenv';

export default class HPdf {
    static async generarCertificado(data: ICertificado, alumno: IAlumno, evento: IEvento) {
        try {
            let codigo = ""
            let fechaFinalStr = ""
            let fechasEvento = []

            const { plantilla_certificado } = evento

            const lugar = 'Lambayeque';
            const pathTemplate = path.resolve(__dirname, `../../public/pdf/${plantilla_certificado}`);
            const pathFontKuenstler = path.resolve(__dirname, '../../public/fonts/KUNSTLER.TTF')
            const pathFontKuenstlerBold = path.resolve(__dirname, "../../public/fonts/Kuenstler Script LT Std 2 Bold.otf");
            const pathFontBalooBold = path.resolve(__dirname, '../../public/fonts/BalooChettan2-Bold.ttf')
            const pathFontBalooMedium = path.resolve(__dirname, '../../public/fonts/BalooChettan2-Medium.ttf')
            const pathLogo = path.resolve(__dirname, '../../public/img/logo_transparente_small.png')

            if (!fs.existsSync(pathTemplate)) {
                return { result: false, message: `No existe la plantilla ${plantilla_certificado}` }
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

            const { nombre_alumno_impresion } = data

            const { titulo, temario, fecha, fecha_fin } = evento

            const { nombre_capitalized } = alumno

            const nombreImpresion = nombre_alumno_impresion as string;
            const tituloEvento = titulo as string
            const fechaEvento = HDate.convertDateToString(fecha as Date)
            const temarioEvento = temario?.split('\n') as String[]

            const fechaInicio = toZonedTime(fecha as Date, 'America/Lima')
            const fechaInicioStr = format(fechaInicio, "dd 'de' MMMM 'del' yyyy", { locale: es })

            // Definiendo el nombre del archivo
            const sanitizedTitulo = HString.sanitizeFileName(titulo as string)
            const sanitizedAlumno = HString.sanitizeFileName(nombre_capitalized as string)
            // const fileName = `certificado_${sanitizedAlumno}.pdf`
            const codEvento = `${evento.id}`.toString().padStart(5, "0");
            const codAlumno = `${alumno.id}`.toString().padStart(5, "0");
            const fileName = `certificado_e${codEvento}_a${codAlumno}.pdf`
            const outputPath = path.resolve(__dirname, `../../public/certificados/${sanitizedTitulo}/${fileName}`)

            let lugarFechaEmision = ''

            if (data.fecha_envio) {
                const fechaEnvio = toZonedTime(data.fecha_envio, 'America/Lima')
                const fechaEmision = format(fechaEnvio, "dd 'de' MMMM 'del' yyyy", { locale: es })
                lugarFechaEmision = `${lugar}, ${fechaEmision}`
            } else {
                lugarFechaEmision = `${lugar}`
            }

            if (fecha_fin) {
                const fechaFinal = toZonedTime(fecha_fin, 'America/Lima')
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
            data.templateName = plantilla_certificado

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
            const pageWidth = pagina.getWidth()

            switch (plantilla_certificado) {
                case "buenas_practicas_agricolas_para_una_produccion_sostenible.pdf":
                case "como_maximizar_la_produccion_de_gallinas_saludables.pdf":
                case "nutricion_alimentacion_y_sanidad_de_animales_menores_y_mayores.pdf":
                case "sanidad_avicola_y_optimizacion_productiva.pdf":
                case "plantillas/plantilla_e.pdf":

                    // Configurar el texto del nombre del alumno
                    fontSizeForAlumno = 54;

                    y = 302;  // Posición Y
                    maxWidth = 720; // Ancho máximo disponible para el texto

                    // Distancia entre líneas para el nombre del alumno
                    lineHeightAlumno = 0.8 * fontSizeForAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForAlumno);

                    if (linesAlumno.length > 1) {
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
                    y -= 90; // Ajustar la posición Y para el siguiente texto

                    for (let i = 0; i < fechasEvento.length; i++) {
                        lineWidthFechaEvento = customFontBalooMedium.widthOfTextAtSize(fechasEvento[i], fontSizeForFechaEvento);
                        fechaEventoPositionX = (pageWidth - lineWidthFechaEvento) / 2;

                        pagina.drawText(fechasEvento[i], {
                            x: fechaEventoPositionX,
                            y: y - i * lineHeightEvento, // Ajustar la posición vertical para cada línea
                            size: fontSizeForFechaEvento,
                            font: customFontBalooMedium,
                            color: rgb(4 / 255, 45 / 255, 71 / 255),
                        });
                    }
                    break
                case "cultivos_saludables.pdf":
                case "manejo_de_cultivo_de_arroz.pdf":
                case "manejo_moderno_de_ovinos.pdf":
                case "metodo_integral_de_prevencion_diagnostico_y_control_de_enfermedades.pdf":
                case "optimizacion_de_la_produccion_porcina.pdf":
                case "tecnicas_avanzadas_para_produccion_sostenible_en_cuyes.pdf":
                case "uso_de_excel_para_interpretar_analisis_de_suelo_y_agua.pdf":
                case "plantillas/plantilla_a.pdf":

                    // Configurar el texto del nombre del alumno
                    fontSizeForAlumno = 48;

                    y = 345;  // Posición Y
                    maxWidth = 720; // Ancho máximo disponible para el texto

                    // Distancia entre líneas para el nombre del alumno
                    lineHeightAlumno = 0.8 * fontSizeForAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForAlumno);

                    if (linesAlumno.length > 1) {
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
                    y -= 90; // Ajustar la posición Y para el siguiente texto

                    for (let i = 0; i < fechasEvento.length; i++) {
                        lineWidthFechaEvento = customFontBalooMedium.widthOfTextAtSize(fechasEvento[i], fontSizeForFechaEvento);
                        fechaEventoPositionX = (pageWidth - lineWidthFechaEvento) / 2;

                        pagina.drawText(fechasEvento[i], {
                            x: fechaEventoPositionX,
                            y: y - i * lineHeightEvento, // Ajustar la posición vertical para cada línea
                            size: fontSizeForFechaEvento,
                            font: customFontBalooMedium,
                            color: rgb(4 / 255, 45 / 255, 71 / 255),
                        });
                    }
                    break
                case "formulacion_y_evaluacion_de_proyectos_agropecuarios.pdf":
                case "manejo_de_camelidos_sudamericanos.pdf":
                case "plantillas/plantilla_b.pdf":
                    // Configurar el texto del nombre del alumno
                    fontSizeForAlumno = 48;

                    y = 365;  // Posición Y
                    maxWidth = 720; // Ancho máximo disponible para el texto

                    // Distancia entre líneas para el nombre del alumno
                    lineHeightAlumno = 0.8 * fontSizeForAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForAlumno);

                    if (linesAlumno.length > 1) {
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

                    for (let i = 0; i < fechasEvento.length; i++) {
                        lineWidthFechaEvento = customFontBalooMedium.widthOfTextAtSize(fechasEvento[i], fontSizeForFechaEvento);
                        fechaEventoPositionX = (pageWidth - lineWidthFechaEvento) / 2;

                        pagina.drawText(fechasEvento[i], {
                            x: fechaEventoPositionX,
                            y: y - i * lineHeightEvento, // Ajustar la posición vertical para cada línea
                            size: fontSizeForFechaEvento,
                            font: customFontBalooMedium,
                            color: rgb(222 / 255, 148 / 255, 40 / 255),
                        });
                    }
                    break
                case "hidroponia_y_calculo_de_soluciones_nutritivas.pdf":
                case "plantillas/plantilla_c.pdf":
                    // Configurar el texto del nombre del alumno
                    fontSizeForAlumno = 48;

                    y = 348;  // Posición Y
                    maxWidth = 640; // Ancho máximo disponible para el texto

                    // Distancia entre líneas para el nombre del alumno
                    lineHeightAlumno = 0.8 * fontSizeForAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForAlumno);

                    if (linesAlumno.length > 1) {
                        fontSizeForAlumno = 44;
                    }

                    // Dibujar el nombre del alumno centrado
                    for (let i = 0; i < linesAlumno.length; i++) {
                        lineWidthAlumno = customFontKuenstlerBold.widthOfTextAtSize(linesAlumno[i], fontSizeForAlumno);
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
                    y -= 90; // Ajustar la posición Y para el siguiente texto

                    // Distancia entre líneas para el nombre del evento
                    lineHeightEvento = 0.8 * fontSizeForEvento;

                    // Dividir el título del evento si es necesario
                    linesEvento = this.splitTextIntoLines(tituloEvento, maxWidth, customFontBalooBold, fontSizeForEvento);

                    for (let i = 0; i < linesEvento.length; i++) {
                        lineWidthEvento = customFontBalooBold.widthOfTextAtSize(linesEvento[i], fontSizeForEvento);
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
                    y -= 60

                    for (let i = 0; i < fechasEvento.length; i++) {
                        lineWidthFechaEvento = customFontBalooMedium.widthOfTextAtSize(fechasEvento[i], fontSizeForFechaEvento);
                        fechaEventoPositionX = 60 + (maxWidth - lineWidthFechaEvento) / 2;

                        pagina.drawText(fechasEvento[i], {
                            x: fechaEventoPositionX,
                            y: y - i * lineHeightEvento, // Ajustar la posición vertical para cada línea
                            size: fontSizeForFechaEvento,
                            font: customFontBalooMedium,
                            color: rgb(222 / 255, 148 / 255, 40 / 255),
                        });
                    }
                    break
                case "manejo_integrado_de_la_roya_del_cafe.pdf":
                case "plantillas/plantilla_d.pdf":
                    // Configurar el texto del nombre del alumno
                    fontSizeForAlumno = 48;

                    y = 345;  // Posición Y
                    maxWidth = 720; // Ancho máximo disponible para el texto

                    // Distancia entre líneas para el nombre del alumno
                    lineHeightAlumno = 0.8 * fontSizeForAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForAlumno);

                    if (linesAlumno.length > 1) {
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

                    y -= 60

                    for (let i = 0; i < fechasEvento.length; i++) {
                        lineWidthFechaEvento = customFontBalooMedium.widthOfTextAtSize(fechasEvento[i], fontSizeForFechaEvento);
                        fechaEventoPositionX = (pageWidth - lineWidthFechaEvento) / 2;

                        pagina.drawText(fechasEvento[i], {
                            x: fechaEventoPositionX,
                            y: y - i * lineHeightEvento, // Ajustar la posición vertical para cada línea
                            size: fontSizeForFechaEvento,
                            font: customFontBalooMedium,
                            color: rgb(222 / 255, 148 / 255, 40 / 255),
                        });
                    }
                    break
                case "manejo_sanitario_de_cuyes_con_fines_comerciales.pdf":
                case "plantillas/plantilla_g.pdf":
                    // Configurar el texto del nombre del alumno
                    fontSizeForAlumno = 60;

                    y = 300;  // Posición Y
                    maxWidth = 500; // Ancho máximo disponible para el texto

                    // Distancia entre líneas para el nombre del alumno
                    lineHeightAlumno = 0.8 * fontSizeForAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForAlumno);

                    if (linesAlumno.length > 1) {
                        fontSizeForAlumno = 54;
                    }

                    // Dibujar el nombre del alumno centrado
                    for (let i = 0; i < linesAlumno.length; i++) {
                        lineWidthAlumno = customFontKuenstlerBold.widthOfTextAtSize(linesAlumno[i], fontSizeForAlumno);
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
                    pagina.drawText(titulo as string, {
                        x,
                        y,
                        size: fontSizeForEvento,
                        font: customFontBalooBold,
                        color: rgb(4 / 255, 45 / 255, 71 / 255),
                    });

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
                case "sanidad_integral_en_cuyes.pdf":
                case "plantillas/plantilla_f.pdf":
                    // Configurar el texto del nombre del alumno
                    fontSizeForAlumno = 48;

                    y = 390;  // Posición Y
                    maxWidth = 720; // Ancho máximo disponible para el texto

                    // Distancia entre líneas para el nombre del alumno
                    lineHeightAlumno = 0.8 * fontSizeForAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForAlumno);

                    if (linesAlumno.length > 1) {
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
                    y -= 75 // Ajustar la posición Y para el siguiente texto

                    for (let i = 0; i < fechasEvento.length; i++) {
                        lineWidthFechaEvento = customFontBalooMedium.widthOfTextAtSize(fechasEvento[i], fontSizeForFechaEvento);
                        fechaEventoPositionX = (pageWidth - lineWidthFechaEvento) / 2;

                        pagina.drawText(fechasEvento[i], {
                            x: fechaEventoPositionX,
                            y: y - i * lineHeightEvento, // Ajustar la posición vertical para cada línea
                            size: fontSizeForFechaEvento,
                            font: customFontBalooMedium,
                            color: rgb(222 / 255, 148 / 255, 40 / 255),
                        });
                    }
                    break
                case "plantillas/plantilla_primer_congreso_internacional_2025.pdf":
                    // Configurar el texto del nombre del alumno
                    fontSizeForAlumno = 56;

                    y = 280;  // Posición Y
                    maxWidth = 720; // Ancho máximo disponible para el texto

                    // Distancia entre líneas para el nombre del alumno
                    lineHeightAlumno = 0.8 * fontSizeForAlumno;

                    // Dividir el nombre del alumno en líneas si excede el ancho máximo
                    linesAlumno = this.splitTextIntoLines(nombreImpresion, maxWidth, customFontKuenstlerBold, fontSizeForAlumno);

                    if (linesAlumno.length > 1) {
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
                    break
            }

            // Crear nueva página para el logo, código QR y tabla
            const newPageWidth = 842
            const newPageHeight = 590
            const newPage = pdfDoc.addPage([newPageWidth, newPageHeight]);

            // Crear un rectángulo para texto introductorio
            const startX = 20
            const startY = newPage.getHeight() - 170
            const cellWidth = 390
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
            const startTemarioY = 390
            const cellWidthTemario = 450
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
            let startQRY = 390
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

    static splitTextIntoLines(text: string, maxWidth: number, font: any, fontSize: number) {
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