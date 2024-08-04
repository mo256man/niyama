import sqlite3

class Database():
    def __init__(self) -> None:
        db_name = "niyama.db"
        self.conn = sqlite3.connect(db_name)
        self.cursor = self.conn.cursor()

    def disconnect(self):
        if self.conn:
            self.conn.close()

    def insert_user(self, name, age):
        insert_query = '''
        INSERT INTO users (name, age) VALUES (?, ?);
        '''
        self.cursor.execute(insert_query, (name, age))
        self.conn.commit()
        print(f"Inserted user {name} with age {age}")

    def get_data(self):
        SQL = "SELECT * FROM niyama;"
        self.cursor.execute(SQL)
        users = self.cursor.fetchall()
        for user in users:
            print(user)

if __name__ == "__main__":
    print("start")
    db = Database()
    db.get_data()
    print("done.")
