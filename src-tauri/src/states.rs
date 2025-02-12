use std::str::FromStr;
use sqlx::{Pool, Sqlite};
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};



pub struct SqlPoolContext {
    pub pool: Pool<Sqlite>,
    pub db_path: String
}


impl SqlPoolContext {
    pub async fn new(db_path: &str) -> Self {
        let pool = SqlitePoolOptions::new()
        .connect_with(
            SqliteConnectOptions::from_str(db_path).unwrap()
            .create_if_missing(true)
            .extension("./libs/vec0")
        ).await.unwrap();

        SqlPoolContext {
            pool,
            db_path: db_path.to_string()
        }
    }
}
