use std::str::FromStr;
use sqlx::{Pool, Sqlite};
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};



pub struct SqlPoolContext {
    pub pool: Pool<Sqlite>,
}


impl SqlPoolContext {
    pub async fn new(db_path: &str) -> Self {
        let pool = SqlitePoolOptions::new()
        .connect_with(
            SqliteConnectOptions::from_str(db_path).unwrap()
            .create_if_missing(true)
            .extension("vec0")
        ).await.unwrap();
        SqlPoolContext {
            pool: pool
        }
    }
}