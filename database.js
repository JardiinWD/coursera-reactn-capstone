import * as SQLite from "expo-sqlite";
// Little Lemon Database
const db = SQLite.openDatabase("little_lemon.db");


export const initializeDatabase = () =>
  new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS menuitems (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT,
            price TEXT,
            description TEXT,
            image TEXT,
            category TEXT
          );`
        );
      },
      (_, error) => {
        reject(error);
      },
      () => {
        resolve();
      }
    );
  });


export const fetchMenuItems = () =>
  new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM menuitems",
          [],
          (_, { rows }) => {
            resolve(rows._array);
          },
          (_, error) => {
            reject(error);
          }
        );
      },
      (_, error) => {
        reject(error);
      }
    );
  });


export const filterMenuItems = (query, activeCategories) =>
  new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM menuitems WHERE name LIKE ? AND category IN (${activeCategories
            .map((category) => "?")
            .join(", ")})`,
          [`%${query}%`, ...activeCategories],
          (_, { rows }) => {
            resolve(rows._array);
          },
          (_, error) => {
            reject(error);
          }
        );
      },
      (_, error) => {
        reject(error);
      }
    );
  });


export const saveMenuItems = (menuItems) => {
  db.transaction((tx) => {
    const insertValues = menuItems
      .map(
        (item) =>
          `("${item.id}", "${item.name}", "${item.price}", "${item.description}", "${item.image}", "${item.category}")`
      )
      .join(", ");

    tx.executeSql(
      `INSERT INTO menuitems (id, name, price, description, image, category) VALUES ${insertValues};`
    );
  });
};



