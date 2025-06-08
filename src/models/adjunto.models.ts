import { Model, DataTypes } from 'sequelize'
import sequelize from '@/config/db'
import TipoAdjunto from './tipoAdjunto.models'
import GrupoAdjunto from './grupoAdjunto.models'
import Evento from './evento.models'

class Adjunto extends Model {
    public id?: number
    public id_tipoadjunto?: number
    public id_grupoadjunto?: number
    public id_evento?: number
    public titulo?: string
    public titulo_url?: string
    public descripcion?: string
    public filename?: string
    public originalname?: string
    public filepath?: string
    public mimetype?: string
    public size?: number
    public es_descargable?: boolean
    public es_visible?: boolean
    public user_crea?: string
    public user_actualiza?: string
    public user_elimina?: string
    public estado?: boolean
}

Adjunto.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_tipoadjunto: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: TipoAdjunto,
            key: 'id'
        }
    },
    id_grupoadjunto: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: GrupoAdjunto,
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
    filename: {
        type: DataTypes.STRING(120),
        allowNull: false
    },
    originalname: {
        type: DataTypes.STRING(180),
        allowNull: false
    },
    filepath: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    mimetype: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    es_descargable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    es_visible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    modelName: 'Adjunto',
    timestamps: true,
    freezeTableName: true
})

Adjunto.belongsTo(TipoAdjunto, { foreignKey: 'id_tipoadjunto' })

Adjunto.belongsTo(GrupoAdjunto, { foreignKey: 'id_grupoadjunto' })

Adjunto.belongsTo(Evento, { foreignKey: 'id_evento' })

export default Adjunto