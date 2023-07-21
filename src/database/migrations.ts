import sequelize from "./connection";

export async function migrateDatabase() {
    await sequelize.sync({ force: false });
    console.log("All models were synchronized successfully.");
}