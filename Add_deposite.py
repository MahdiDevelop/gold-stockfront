import pandas as pd
import MySQLdb
from MySQLdb import Error
import sys

def create_tables_if_not_exist(cursor):
    """Create tables if they don't exist"""
    try:
        # Create customers table if not exists
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS accounts (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            user_id INT DEFAULT 1,
            name VARCHAR(255) NOT NULL,
            serial BIGINT UNSIGNED DEFAULT 1,
            whatsup TINYINT DEFAULT 1,
            ontransaction TINYINT(1) DEFAULT 0,
            isdelete TINYINT(1) DEFAULT 0,
            date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP NULL,
            updated_at TIMESTAMP NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """)
        
        # Create belance table if not exists
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS belances (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            account_id BIGINT UNSIGNED NOT NULL,
            money_id BIGINT UNSIGNED DEFAULT 1,
            user_id BIGINT UNSIGNED DEFAULT 1,
            belance BIGINT DEFAULT 0,
            isdelete TINYINT(1) DEFAULT 0,
            ontransaction TINYINT(1) DEFAULT 0,
            date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP NULL,
            updated_at TIMESTAMP NULL,
            FOREIGN KEY (account_id) REFERENCES customers(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """)
        print("✅ Tables created/verified successfully")
    except Error as e:
        print(f"Error creating tables: {e}")
        raise

def import_data_from_excel():
    try:
        # Excel file path
        file_path = "backup.xlsx"
        
        # Read Excel file
        try:
            df = pd.read_excel(file_path, usecols=["name", "م", "remain"], engine="openpyxl")
            # Convert 'remain' to numeric and replace NaN with 0
            df['remain'] = pd.to_numeric(df['remain'], errors='coerce').fillna(0)
            print(f"📊 Loaded {len(df)} records from Excel")
        except Exception as e:
            print(f"❌ Error reading Excel file: {e}")
            return

        # Database connection
        try:
            conn = MySQLdb.connect(
                host="localhost",
                user="root",
                passwd="Mahdi@123",
                db="laravel",
                charset="utf8mb4"
            )
            cursor = conn.cursor()
            print("🔌 Connected to database successfully")
        except Error as e:
            print(f"❌ Error connecting to MySQL: {e}")
            return

        # Create tables if they don't exist
        create_tables_if_not_exist(cursor)
        conn.commit()

        # Process each row
        success_count = 0
        for index, row in df.iterrows():
            # Skip if name is empty
            if pd.isna(row['name']):
                print(f"⚠️ Skipping row {index+1}: Empty name")
                continue

            try:
                # Insert into customers table
                customer_sql = """
                INSERT INTO accounts 
                (name, whatsup, serial, user_id, created_at, updated_at) 
                VALUES (%s, 1, 1, 1, NOW(), NOW())
                """
                cursor.execute(customer_sql, (row['name'].strip(),))
                customer_id = cursor.lastrowid
                
                # Insert into belance table (using negative value for remain)
                balance_sql = """
                INSERT INTO belances 
                (account_id, type_id, user_id, belance, created_at, updated_at) 
                VALUES (%s, 1, 1, %s, NOW(), NOW())
                """
                cursor.execute(balance_sql, (customer_id, -abs(row['remain'])))
                belance_id = cursor.lastrowid

                report_sql = """
                INSERT INTO reports 
                (account_id, type, user_id, amount, created_at, updated_at) 
                VALUES (1, from, 1, %s, NOW(), NOW())
                """
                cursor.execute(balance_sql, (abs(row['remain'])))
                t_id = cursor.lastrowid

                report_sql = """
                INSERT INTO reports 
                (account_id, type, user_id, amount, created_at, updated_at, transformation) 
                VALUES (%s, to, 1, %s, NOW(), NOW(),%s)
                """
                cursor.execute(balance_sql, (belance_id, abs(row['remain']),t_id))


                success_count += 1
                if success_count % 10 == 0:
                    print(f"✅ Processed {success_count} records...")
                
            except Error as e:
                print(f"❌ Error inserting data for '{row['name']}': {e}")
                conn.rollback()
                continue

        # Commit changes
        conn.commit()
        print(f"\n🎉 Successfully imported {success_count} out of {len(df)} records")
        print("✅ داده‌ها با موفقیت به جدول customers و belance اضافه شدند!")

    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        if 'conn' in locals():
            conn.rollback()
    finally:
        # Close connection
        if 'conn' in locals() and conn.open:
            cursor.close()
            conn.close()
            print("🔌 Database connection closed")

if __name__ == "__main__":
    import_data_from_excel()
