-- Crear la base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS experiencias_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

-- Seleccionar la base
USE experiencias_db;

-- Crear tabla de reservas
CREATE TABLE IF NOT EXISTS reservas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_id VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- índices para mejorar consultas
  INDEX idx_event (event_id),
  INDEX idx_email (email),
  INDEX idx_created (created_at)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;

-- (opcional)
CREATE TABLE IF NOT EXISTS eventos (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  date DATE NOT NULL,
  start TIME,
  end TIME,
  location VARCHAR(150),
  capacity INT UNSIGNED NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;
-- Crear la base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS experiencias_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

-- Seleccionar la base
USE experiencias_db;

-- Tabla de eventos
CREATE TABLE IF NOT EXISTS eventos (
  id VARCHAR(50) PRIMARY KEY,              -- ej: exp-001
  title VARCHAR(200) NOT NULL,             -- nombre del evento
  date DATE NOT NULL,                      -- fecha
  start TIME,                              -- hora de inicio
  end TIME,                                -- hora de fin
  location VARCHAR(150),                   -- ubicación
  capacity INT UNSIGNED NOT NULL,          -- cupo máximo
  available INT UNSIGNED NOT NULL,         -- lugares disponibles
  price DECIMAL(10,2) NOT NULL,            -- precio ARS
  category VARCHAR(50),                    -- ej: manga, nocturna, cata
  description TEXT,                        -- texto descriptivo
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;

-- Tabla de reservas (relacionada con eventos)
CREATE TABLE IF NOT EXISTS reservas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_id VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- relación con eventos
  CONSTRAINT fk_reserva_event FOREIGN KEY (event_id)
    REFERENCES eventos(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  -- índices
  INDEX idx_event (event_id),
  INDEX idx_email (email),
  INDEX idx_created (created_at)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;
INSERT INTO eventos (id, title, date, start, end, location, capacity, available, price, category, description)
VALUES
('exp-001', 'Ruta de Cafeterías — Edición Manga', '2025-09-20', '17:00', '20:30', 'Córdoba Centro', 23, 8, 12000, 'manga', 'Recorrido por 3 cafeterías temáticas con actividad de dibujo y trivia manga.'),
('exp-002', 'Experiencia Nocturna — Café & Jazz', '2025-09-28', '21:00', '23:45', 'Güemes', 23, 3, 15000, 'nocturna', 'Edición íntima con maridaje dulce y música en vivo.'),
('exp-003', 'Cata con Barista — Orígenes & Métodos', '2025-10-05', '18:00', '20:00', 'Nueva Córdoba', 23, 16, 18000, 'cata', 'Cata guiada de orígenes + V60 y Aeropress.');
