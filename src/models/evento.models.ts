import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db'
import TipoEvento from './tipoEvento.models'

class Evento extends Model {
    public id?: number
    public id_parent?: number
    public id_tipoevento?: number
    public titulo?: string
    public titulo_url?: string
    public descripcion?: string
    public temario?: string
    public plantilla_certificado?: string
    public fecha?: Date
    public modalidad?: 'PRESENCIAL' | 'VIRTUAL'
    public precio?: number
    public user_crea?: string
    public user_actualiza?: string
    public user_elimina?: string
    public estado?: boolean
}

Evento.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_parent: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Evento,
            key: 'id'
        }
    },
    id_tipoevento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoEvento,
            key: 'id'
        }
    },
    titulo: {
        type: DataTypes.STRING(70),
        allowNull: false
    },
    titulo_url: {
        type: DataTypes.STRING(90),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(70),
        allowNull: true
    },
    temario: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    plantilla_certificado: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: true
    },
    modalidad: {
        type: DataTypes.ENUM('PRESENCIAL', 'VIRTUAL'),
        allowNull: false
    },
    precio: {
        type: DataTypes.DOUBLE,
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
    modelName: 'Evento',
    timestamps: true,
    freezeTableName: true
})

Evento.belongsTo(TipoEvento, {foreignKey: 'id_tipoevento'})

export default Evento