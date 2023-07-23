import sequelize from "./connection";

export async function migrateDatabase() {
    await sequelize.sync({ alter: true });
    console.log("All models were synchronized successfully.");
}