import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/db'
import Alumno from './alumno.models'
import Evento from './evento.models'

class Matricula extends Model {
    public id?: number
    public id_alumno?: number
    public id_evento?: number
    public subtotal?: number
    public igv?: number
    public total?: number
    public moneda?: 'PEN' | 'USD'
    public fecha_pago?: string
    public forma_pago?: 'CONTADO' | 'CREDITO'
    public tipo_pago?: 'EFECTIVO' | 'TARJETA' | 'DEPOSITO'
    public nro_voucher?: string
    public nro_deposito?: string
    public imagen_pago?: string
    public acuenta?: number
    public saldo?: number
    public user_crea?: string
    public user_actualiza?: string
    public user_elimina?: string 
    public estado_pago?: 'PARCIAL' | 'TOTAL'
    public estado?: boolean
}

Matricula.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    subtotal: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    igv: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    total: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    moneda: {
        type: DataTypes.ENUM('PEN', 'USD'),
        allowNull: false
    },
    fecha_pago: {
        type: DataTypes.STRING(12),
        allowNull: false
    },
    forma_pago: {
        type: DataTypes.ENUM('CONTADO', 'CREDITO'),
        allowNull: false
    },
    tipo_pago: {
        type: DataTypes.ENUM('EFECTIVO', 'TARJETA', 'DEPOSITO'),
        allowNull: false
    },
    nro_voucher: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    nro_deposito: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    imagen_pago: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    acuenta: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    saldo: {
        type: DataTypes.DOUBLE,
        allowNull: false
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
    estado_pago: {
        type: DataTypes.ENUM('PARCIAL', 'TOTAL'),
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'Matricula',
    timestamps: true,
    freezeTableName: true
})

Matricula.belongsTo(Alumno, {foreignKey: 'id_alumno'})

Matricula.belongsTo(Evento, {foreignKey: 'id_evento'})

export default Matricula