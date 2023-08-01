import {Model, Column, DataType, Table, Unique} from "sequelize-typescript";


@Table({
    tableName: "users"
})

class Users extends Model {

    @Column({primaryKey: true, type: DataType.UUID, defaultValue: DataType.UUIDV4})
    id!: string;

    @Unique
    @Column
    username!: string;

    @Column
    password!: string;
}

export {Users}