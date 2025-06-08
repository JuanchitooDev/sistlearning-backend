import { IUsuario, UsuarioResponse } from "@/interfaces/usuarioInterface"
import { AuthResponse, IAuth } from "@/interfaces/authInterface"
import LogSesion from "@/models/logSesion.models";
import Usuario from "@/models/usuario.models"
import PerfilService from "../services/perfil.service"
import AlumnoService from "../services/alumno.service"
import InstructorService from "../services/instructor.service"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IPerfil } from "@/interfaces/perfilInterface";
import { IAlumno } from "@/interfaces/alumnoInterface";
import { IInstructor } from "@/interfaces/instructorInterface";
import TrabajadorService from '@/services/trabajador.service';
import { ITrabajador } from "@/interfaces/trabajadorInterface";

class AuthRepository {
    async login(data: IAuth): Promise<AuthResponse> {
        try {
            let usuarioAutenticado: IAuth = {}

            const dataUsername = data.username as string
            const dataPassword = data.password as string
            const userAgent = data.userAgent as string

            const getUsuario = await Usuario.findOne(
                {
                    where: {
                        username: dataUsername
                    }
                }
            )

            if (!getUsuario) {
                return { result: false, data: [], message: 'Usuario no encontrado', status: 404 }
            }

            const {
                id_perfil,
                id_trabajador,
                id_alumno,
                id_instructor,
                username
            } = getUsuario

            usuarioAutenticado.idPerfil = id_perfil
            usuarioAutenticado.idTrabajador = id_trabajador
            usuarioAutenticado.idAlumno = id_alumno
            usuarioAutenticado.idInstructor = id_instructor
            usuarioAutenticado.username = username

            if (id_perfil) {
                const responsePerfil = await PerfilService.getPerfilPorId(id_perfil)
                const perfil = responsePerfil.data as IPerfil

                if (perfil) {
                    usuarioAutenticado.nombrePerfil = perfil.nombre
                    usuarioAutenticado.slugPerfil = perfil.nombre_url
                }
            }

            if (id_alumno && !id_instructor && !id_trabajador) {
                const responseAlumno = await AlumnoService.getAlumnoPorId(id_alumno)
                const alumno = responseAlumno.data as IAlumno

                if (alumno) {
                    const nombreCompleto = alumno.nombre_capitalized
                    usuarioAutenticado.usuario = nombreCompleto
                }
            } else if (!id_alumno && id_instructor && !id_trabajador) {
                const responseInstructor = await InstructorService.getInstructorPorId(id_instructor)
                const instructor = responseInstructor.data as IInstructor

                if (instructor) {
                    const nombreCompleto = instructor.nombre_capitalized
                    usuarioAutenticado.usuario = nombreCompleto
                }
            } else if (!id_alumno && !id_instructor && id_trabajador) {
                const responseTrabajador = await TrabajadorService.getTrabajadorPorId(id_trabajador)
                const trabajador = responseTrabajador.data as ITrabajador

                if (trabajador) {
                    const nombreCompleto = `${trabajador.nombres} ${trabajador.apellido_paterno} ${trabajador.apellido_materno}`
                    usuarioAutenticado.usuario = nombreCompleto
                }
            }

            const isPassword = await bcrypt.compare(dataPassword, getUsuario.password as string)

            if (!isPassword) {
                return { result: false, data: [], message: 'Credenciales inválidas', status: 500 }
            }

            const token = jwt.sign(
                { id: getUsuario.id, username: getUsuario.username },
                process.env.JWT_SECRET || '',
                { expiresIn: process.env.EXPIRE_TOKEN }
            )

            // Actualizar el token y la fecha de inicio de sesión
            const updatedUsuario = await getUsuario.update(
                {
                    token,
                    fecha_sesion: new Date()
                }
            )

            if (updatedUsuario) {
                // Registrar el inicio de sesión en la bitácora
                const newSesion = await LogSesion.create(
                    {
                        token,
                        id_usuario: getUsuario.id,
                        fecha_sesion: new Date(),
                        user_agent: userAgent
                    }
                )

                if (newSesion.id) {
                    return { result: true, token, message: 'Inicio de sesión exitoso', data: usuarioAutenticado, status: 200 }
                }

                return { result: false, token: "", message: 'Error de inicio de sesión', data: [], status: 500 }
            }

            return { result: false, data: [], message: 'Error de inicio de sesión', status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async logout(userId: number): Promise<UsuarioResponse> {
        try {
            const usuario = await Usuario.findOne(
                {
                    where: {
                        id: userId
                    }
                }
            )

            if (!usuario) {
                return { result: false, error: 'Usuario no encontrado', status: 404 }
            }

            // Eliminar el token del usuario
            await usuario.update(
                {
                    token: null,
                    fecha_sesion: null
                }
            )

            return {
                result: true,
                message: 'Sesión cerrada con éxito',
                status: 200
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }
}

export default new AuthRepository()