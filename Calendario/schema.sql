-- schema.sql (ejemplo simple para guardar eventos y reservas)
CREATE TABLE events (
  id VARCHAR(64) PRIMARY KEY,
  title TEXT,
  date DATE,
  start TIME,
  end_time TIME,
  location TEXT,
  capacity INTEGER,
  available INTEGER,
  price INTEGER,
  category VARCHAR(64),
  description TEXT,
  reserve_url TEXT
);
