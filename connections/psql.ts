import { Sequelize } from 'sequelize-typescript';
import { Users } from '../models/users';

const connection = new Sequelize("postgres://postgres:postgres@localhost:5432/postgres", {
    models : [Users]
});

export default connection;
