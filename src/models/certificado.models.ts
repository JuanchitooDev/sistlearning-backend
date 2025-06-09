import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db'
import Alumno from './alumno.models'
import Evento from './evento.models'

class Certificado extends Model {
    public id?: number
    public id_alumno?: number
    public id_evento?: number
    public nombre_alumno_impresion?: string
    public codigo?: string
    public codigoQR?: string
    public ruta?: string
    public fileName?: string
    public templateName?: string
    public fecha_registro?: string
    public fecha_descarga?: string
    public fecha_envio?: string
    public user_crea?: string
    public user_actualiza?: string
    public user_elimina?: string
    public sistema?: boolean
    public estado?: boolean
}

Certificado.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_alumno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Alumno,
            key: 'id'
        }
    },
    id_evento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Evento,
            key: 'id'
        }
    },
    nombre_alumno_impresion: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    codigo: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    codigoQR: {
        type: DataTypes.STRING(350),
        allowNull: true
    },
    ruta: {
        type: DataTypes.STRING(350),
        allowNull: true
    },
    fileName: {
        type: DataTypes.STRING(300),
        allowNull: false
    },
    templateName: {
        type: DataTypes.STRING(120),
        allowNull: true
    },
    fecha_registro: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    fecha_descarga: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    fecha_envio: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    user_crea: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    user_actualiza: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    user_elimina: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    sistema: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'Certificado',
    timestamps: true,
    freezeTableName: true
})

Certificado.belongsTo(Alumno, { foreignKey: 'id_alumno' })

Certificado.belongsTo(Evento, { foreignKey: 'id_evento' })

export default Certificado