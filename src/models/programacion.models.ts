import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db'
import Evento from './evento.models'
import Trabajador from './trabajador.models'

class Programacion extends Model {
    public id?: number
    public id_trabajador?: number
    public id_evento?: number
    public descripcion?: string
    public enlace?: string
    public fecha_inicio?: string
    public fecha_final?: string
    public fecha_reprograma?: string
    public fecha_cancela?: string
    public fecha_registro?: string
    public user_crea?: string
    public user_actualiza?: string
    public user_elimina?: string
    public estado?: boolean
}

Programacion.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_trabajador: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Trabajador,
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
    descripcion: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    enlace: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    fecha_inicio: {
        type: DataTypes.STRING(12),
        allowNull: false
    },
    fecha_final: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    fecha_reprograma: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    fecha_cancela: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    fecha_registro: {
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
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'Programacion',
    timestamps: true,
    freezeTableName: true
})

Programacion.belongsTo(Trabajador, { foreignKey: 'id_trabajador' })

Programacion.belongsTo(Evento, { foreignKey: 'id_evento' })

export default Programacion