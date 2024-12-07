import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db'
import TipoDocumento from './tipoDocumento.models';
import Cargo from './cargo.models';

class Trabajador extends Model {
    public id?: number
    public id_cargo?: number
    public id_tipodocumento?: number
    public numero_documento?: string
    public apellido_paterno?: string
    public apellido_materno?: string
    public nombres?: string
    public telefono?: string
    public direccion?: string
    public email?: string
    public linkedin?: string
    public fecha_nacimiento?: string
    public biografia?: string
    public sexo?: string
    public firma?: string
    public foto_perfil?: string
    public user_crea?: string
    public user_actualiza?: string
    public user_elimina?: string
    public sistema?: boolean
    public estado?: boolean
}

Trabajador.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_cargo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cargo,
            key: 'id'
        }
    },
    id_tipodocumento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoDocumento,
            key: 'id'
        }
    },
    numero_documento: {
        type: DataTypes.STRING(13),
        allowNull: false
    },
    apellido_paterno: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    apellido_materno: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    nombres: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    linkedin: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    fecha_nacimiento: {
        type: DataTypes.STRING(12),
        allowNull: false
    },
    biografia: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    sexo: {
        type: DataTypes.CHAR(1),
        allowNull: false
    },
    firma: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    foto_perfil: {
        type: DataTypes.STRING(100),
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
    modelName: 'Trabajador',
    timestamps: true,
    freezeTableName: true
})

Trabajador.belongsTo(Cargo, { foreignKey: 'id_cargo' })

Trabajador.belongsTo(TipoDocumento, { foreignKey: 'id_tipodocumento' })

export default Trabajador