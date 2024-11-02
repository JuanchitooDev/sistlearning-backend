import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db'
import TipoContenido from './tipoContenido.models'
import Evento from './evento.models'

class Contenido extends Model {
    public id?: number
    public id_tipocontenido?: number
    public id_evento?: number
    public titulo?: string
    public titulo_url?: string
    public descripcion?: string
    public url?: string
    public es_descargable?: boolean
    public user_crea?: string
    public user_actualiza?: string
    public user_elimina?: string
    public estado?: boolean
}

Contenido.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_tipocontenido: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoContenido,
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
    titulo: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    titulo_url: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    url: {
        type: DataTypes.STRING(80),
        allowNull: true
    },
    es_descargable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    modelName: 'Contenido',
    timestamps: true,
    freezeTableName: true
})

Contenido.belongsTo(TipoContenido, {foreignKey: 'id_tipocontenido'})

Contenido.belongsTo(Evento, {foreignKey: 'id_evento'})

export default Contenido