from faker import Faker
import time
import random
import psycopg2
from psycopg2.extras import execute_batch
 
fake = Faker()

conn = psycopg2.connect(
    host="localhost",
    port=5433,
    dbname="postgres",
    user="postgres",
    password="postgres"
)
cursor = conn.cursor()
num_records = 5_000_000
batch_size = 50_000
data = []

start_time = time.time()
for i in range(num_records):
    name = fake.name()
    salt = list(str(round(time.time() * 1000))[::-1][:10])
    random.shuffle(salt)
    email = fake.email() + ''.join(salt)
    tarif = fake.random_element(elements=['basic', 'full', 'corporate'])
    company = fake.company()
    password = fake.password()
    data.append((name, email, tarif, company, password))

    if i % 10000 == 0:
        print(f"Inserted {i} records in {time.time() - start_time:.2f} s")


    if len(data) >= batch_size:
        try:
            execute_batch(
                cursor,
                "INSERT INTO public.customers (name, email, tariff, company, password) VALUES (%s, %s, %s, %s, %s)",
                data
            )
            conn.commit()
            data = []
        except Exception as e:
            print(e)
            exit()


conn.commit()
cursor.close()
conn.close()