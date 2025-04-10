CREATE DATABASE IF NOT EXISTS patitas_db;

USE patitas_db;

CREATE TABLE Tipo_usuario(
	id_tipo INT PRIMARY KEY AUTO_INCREMENT,
    
    -- ADMINISTRADOR, CLIENTE, VETERINARIA
    tipo_usuario VARCHAR (50) UNIQUE NOT NULL
);

CREATE TABLE Usuario(
	id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    id_tipo_usuario INT NOT NULL,
	correo_electronico VARCHAR(50) UNIQUE NOT NULL,
    contraseña VARCHAR(30) NOT NULL,
    telefono VARCHAR(10) UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    apellidos VARCHAR(100),
    fecha_nacimiento DATE,
    ubicacion TEXT,
    sexo VARCHAR(1),
    sobre_mi TEXT,
    
    FOREIGN KEY (id_tipo_usuario) REFERENCES Tipo_usuario(id_tipo)
);

CREATE TABLE Veterinario(
	id_veterinario INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(50) NOT NULL,
    cedula VARCHAR(50) NOT NULL,
    edad INT NOT NULL,
    
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Status_animal(
	id_status INT PRIMARY KEY AUTO_INCREMENT,
    
    -- RESCATADO, CALLEJERO, MASCOTA
    status_animal VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Especie(
	id_especie INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Perro, Gato, Pajaro, Conejo, Vaca, Toro, Mono, Hamster
    especie VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Animal(
	id_animal INT PRIMARY KEY AUTO_INCREMENT,
    id_status_animal INT,
    nombre VARCHAR(50) NOT NULL,
    id_especie INT NOT NULL,
    raza VARCHAR(50),
    sexo VARCHAR(1) NOT NULL,
    edad INT,
    peso INT,
    descripcion TEXT NOT NULL,
    cartilla VARCHAR(50),
    foto_animal LONGBLOB,
    disponible_para_adopcion BOOL NOT NULL,
    fecha_nacimiento DATE,
    
    FOREIGN KEY (id_status_animal) REFERENCES Status_animal(id_status),
    FOREIGN KEY (id_especie) REFERENCES Especie(id_especie)
);

-- maybe cambiar a tabla mascota para conectar todas las mascotas a sus duenos
-- o mantener tabla adopcion y crear tabla mascota
-- tabla que sirve como historial de adopciones	
CREATE TABLE Adopcion(
	id_adopcion INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_animal INT NOT NULL,
    fecha_adopcion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_animal) REFERENCES Animal(id_animal)
);

-- posible tabla mascotas
-- tabla creada para manejar las consultas select de mascotas
CREATE TABLE Mascota(
	id_mascota INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_animal INT NOT NULL,
    
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_animal) REFERENCES Animal(id_animal)
);

CREATE TABLE Vacuna(
	id_vacuna INT PRIMARY KEY AUTO_INCREMENT,
    
    -- RABIA, PARVOVIRUS CANINO, MOQUILLO, HEPATITS CANINA, LEUCEMIA FELINA, ETC
    tipo_vacuna VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Status_vacunacion(
	id_status INT PRIMARY KEY AUTO_INCREMENT,
    
    -- EN PROCESO, FINALIZADO, SOLICITADO, CANCELADO
    status_vacunacion VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Vacunacion(
	id_solicitud INT PRIMARY KEY AUTO_INCREMENT,
    id_animal INT,
    id_vacuna INT,
    id_status_vacunacion INT,
    id_veterinaria INT,
    id_veterinario INT,
    vacunado BOOL NOT NULL,
    fecha_vacunacion DATE,
	hora TIME,
    
    FOREIGN KEY (id_animal) REFERENCES Animal(id_animal),
    FOREIGN KEY (id_vacuna) REFERENCES Vacuna(id_vacuna),
    FOREIGN KEY (id_status_vacunacion) REFERENCES Status_vacunacion(id_status),
    FOREIGN KEY (id_veterinaria) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_veterinario) REFERENCES Veterinario(id_veterinario)
);

CREATE TABLE Tipo_denuncia(
	id_tipo INT PRIMARY KEY AUTO_INCREMENT,
    
    -- MALTRATO, PERDIDA
    tipo_denuncia VARCHAR(50) NOT NULL
);

CREATE TABLE Status_denuncia(
	id_status INT PRIMARY KEY AUTO_INCREMENT,
    
    -- EN PROCESO, RESUELTO, EN INVESTIGACION, ARCHIVADO, PENDIENTE, CERRADO
    status_denuncia VARCHAR(50)
);

CREATE TABLE Denuncia (
	id_denuncia INT PRIMARY KEY AUTO_INCREMENT,
    id_tipo_denuncia INT NOT NULL,
    id_status_denuncia INT NOT NULL,
    id_usuario INT NOT NULL,
    titulo VARCHAR (50) NOT NULL,
    avistamiento_fecha DATE NOT NULL,
    descripcion_animal TEXT DEFAULT NULL,
    descripcion_ubicacion TEXT DEFAULT NULL,
    descripcion_maltrato TEXT DEFAULT NULL,
    ubicacion TEXT NOT NULL,
    imagen LONGBLOB DEFAULT NULL,
    recompensa DECIMAL(10,2) DEFAULT NULL,
    denuncia_fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    
	FOREIGN KEY (id_tipo_denuncia) REFERENCES Tipo_denuncia(id_tipo),
	FOREIGN KEY (id_status_denuncia) REFERENCES Status_denuncia(id_status),
	FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

-- tabla que guarda cuando hay inserciones en la tabla Denuncia o Vacunacion
CREATE TABLE Seguimiento (
    id_seguimiento INT PRIMARY KEY AUTO_INCREMENT,
    tabla VARCHAR(50) NOT NULL,
    id_registro INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //
CREATE TRIGGER after_denuncia_insert
AFTER INSERT ON Denuncia
FOR EACH ROW
BEGIN
    INSERT INTO Seguimiento (tabla, id_registro)
    VALUES ('Denuncia', NEW.id_denuncia);
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER after_vacunacion_insert
AFTER INSERT ON Vacunacion
FOR EACH ROW
BEGIN
    INSERT INTO Seguimiento (tabla, id_registro)
    VALUES ('Vacunacion', NEW.id_solicitud);
END;
//
DELIMITER ;


SELECT NOW();

-- INSERT

INSERT INTO Tipo_usuario (tipo_usuario) VALUE ('VETERINARIA');
INSERT INTO Tipo_usuario (tipo_usuario) VALUE ('CLIENTE');

INSERT INTO Status_animal (status_animal) VALUES 
('RESCATADO'),
('CALLEJERO'),
('MASCOTA');

INSERT INTO Especie (especie) VALUES 
('Perro'),
('Gato'),
('Pajaro'),
('Conejo'),
('Vaca'),
('Toro'),
('Mono'),
('Hamster');
	
INSERT INTO Status_vacunacion (status_vacunacion) VALUES 
('SOLICITADO'),
('EN PROCESO'),
('FINALIZADO'),
('CANCELADO');

INSERT INTO Tipo_denuncia (tipo_denuncia) VALUES 
('MALTRATO'),
('PERDIDA');

INSERT INTO Status_denuncia (status_denuncia) VALUES 
('EN ESPERA'),
('EN PROCESO'),
('COMPLETADO'),
('HALLADO'),
('CERRADO');

INSERT INTO Vacuna (tipo_vacuna) VALUES 
('RABIA'),
('PARVOVIRUS CANINO'),
('MOQUILLO'),
('HEPATITIS CANINA'),
('LEUCEMIA FELINA');

-- SELECT

SELECT * FROM Tipo_usuario ORDER BY id_tipo;
SELECT * FROM Status_animal ORDER BY id_status;
SELECT * FROM Status_vacunacion ORDER BY id_status;
SELECT * FROM Tipo_denuncia ORDER BY id_tipo;
SELECT * FROM Status_denuncia ORDER BY id_status;
SELECT * FROM Vacuna ORDER BY id_vacuna;


-- Inserts para la tabla Usuario (Veterinarias)
INSERT INTO Usuario (id_tipo_usuario, correo_electronico, contraseña, nombre)
VALUES (1, 'vet1@clinic.com', 'vetpass1', 'Veterinaria Uno');

INSERT INTO Usuario (id_tipo_usuario, correo_electronico, contraseña, nombre)
VALUES (1, 'vet2@clinic.com', 'vetpass2', 'Veterinaria Dos');

INSERT INTO Usuario (id_tipo_usuario, correo_electronico, contraseña, nombre)
VALUES (1, 'vet3@clinic.com', 'vetpass3', 'Veterinaria Tres');

INSERT INTO Usuario (id_tipo_usuario, correo_electronico, contraseña, nombre)
VALUES (1, 'vet4@clinic.com', 'vetpass4', 'Veterinaria Cuatro');

INSERT INTO Usuario (id_tipo_usuario, correo_electronico, contraseña, nombre)
VALUES (1, 'vet5@clinic.com', 'vetpass5', 'Veterinaria Cinco');

-- Inserts para la tabla Veterinario para la primera veterinaria (id_usuario = 1)
INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (1, 'Carlos', 'Perez', '123456', 35);

INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (1, 'jose', 'Gomez', '234567', 40);

INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (1, 'Luis', 'Ramirez', '345678', 30);

INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (1, 'Maria', 'Lopez', '456789', 28);

INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (1, 'Jose', 'Martinez', '567890', 45);

-- Inserts para la segunda veterinaria (id_usuario = 2)
INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (2, 'Lucia', 'Fernandez', '678901', 38);

INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (2, 'Pedro', 'Sanchez', '789012', 42);

INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (2, 'Laura', 'Diaz', '890123', 33);

INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (2, 'Andres', 'Torres', '901234', 37);

INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (2, 'Sofia', 'Gonzalez', '012345', 41);

-- Inserts para la tercera veterinaria (id_usuario = 3)
INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (3, 'Raul', 'Mendez', '112233', 39);

INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (3, 'Carla', 'Morales', '223344', 32);

INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (3, 'Diana', 'Ortega', '334455', 29);

INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (3, 'Esteban', 'Vega', '445566', 34);

INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (3, 'Elena', 'Campos', '556677', 36);

-- Inserts para la cuarta veterinaria (id_usuario = 4)
INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (4, 'Miguel', 'Paredes', '667788', 43);

INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (4, 'Sandra', 'Valencia', '778899', 29);

INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (4, 'Oscar', 'Navarro', '889900', 41);

INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (4, 'Patricia', 'Lara', '990011', 30);

INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (4, 'Jorge', 'Ibanez', '101112', 38);

-- Inserts para la quinta veterinaria (id_usuario = 5)
INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (5, 'Fernando', 'Herrera', '213141', 37);

INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (5, 'Isabel', 'Castro', '314151', 35);

INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (5, 'Ramon', 'Gil', '415161', 28);

INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (5, 'Angela', 'Nieves', '516171', 31);

INSERT INTO Veterinario (id_usuario, nombre, apellidos, cedula, edad)
VALUES (5, 'Felipe', 'Duarte', '617181', 40);

-- CLIENTE
INSERT INTO Usuario (id_tipo_usuario, correo_electronico, contraseña, nombre, apellidos, fecha_nacimiento, sexo) 
VALUES (2, 'ej@co.com', '1234dadad5', 'Nomb', 'apell', '2003-09-10', 'M');

INSERT INTO Usuario (id_tipo_usuario, correo_electronico, contraseña, nombre, apellidos, fecha_nacimiento, sexo) 
VALUES (2, 'ej@coda.com', '12345dadad', 'Nomb', 'apell', '2003-09-10', 'M');

INSERT INTO Usuario (id_tipo_usuario, correo_electronico, contraseña, nombre, apellidos, fecha_nacimiento, sexo) 
VALUES (2, 'ej@cods.com', '123456789', 'Nomba', 'apells', '2003-09-10', 'M');

SELECT * FROM Usuario ORDER BY id_usuario;	

INSERT INTO Animal (id_status_animal, nombre, id_especie, raza, sexo, edad, peso, descripcion, cartilla, foto_animal, disponible_para_adopcion, fecha_nacimiento)
VALUES (1, 'Pelusa', 2, 'Siamés', 'M', 3, 5, 'Pelusa es un gato cariñoso y juguetón.', 'Cartilla de vacunación al día', LOAD_FILE('/var/lib/mysql-files/alan.png'), TRUE, '2020-04-15');

-- Insertar un perro llamado Max
INSERT INTO Animal (id_status_animal, nombre, id_especie, raza, sexo, edad, peso, descripcion, cartilla, foto_animal, disponible_para_adopcion, fecha_nacimiento)
VALUES (2, 'Max', 1, 'Labrador Retriever', 'M', 2, 25, 'Max es un perro muy activo y le encanta jugar al aire libre.', 'Cartilla de vacunación pendiente', LOAD_FILE('/var/lib/mysql-files/alan.png'), TRUE, '2019-09-10');

-- Insertar un gato llamado Luna
INSERT INTO Animal (id_status_animal, nombre, id_especie, raza, sexo, edad, peso, descripcion, cartilla, foto_animal, disponible_para_adopcion, fecha_nacimiento)
VALUES (3, 'Luna', 2, 'Persa', 'F', 4, 7, 'Luna es una gata tranquila y amorosa que disfruta pasar tiempo en el regazo de su dueño.', 'Cartilla de vacunación al día', LOAD_FILE('/var/lib/mysql-files/alan.png'), TRUE, '2018-12-03');

-- Insertar un conejo llamado Pancho
INSERT INTO Animal (id_status_animal, nombre, id_especie, raza, sexo, edad, peso, descripcion, cartilla, foto_animal, disponible_para_adopcion, fecha_nacimiento)
VALUES (1, 'Pancho', 5, 'Holandés', 'M', 1, 3, 'Pancho es un conejo juguetón y curioso que se lleva bien con otros animales.', 'Cartilla de vacunación al día', LOAD_FILE('/var/lib/mysql-files/alan.png'), FALSE, '2023-02-28');

SELECT * FROM Animal ORDER BY id_animal;

INSERT INTO Denuncia (id_tipo_denuncia, id_status_denuncia, id_usuario, titulo, avistamiento_fecha, descripcion_animal, descripcion_ubicacion, descripcion_maltrato, ubicacion, imagen, recompensa) VALUES 
(1, 1, 1, 'Maltrato a perro callejero', '2024-05-15', 'Perro mestizo de tamaño mediano', 'Se avistó a un perro callejero siendo maltratado por un individuo en la calle principal.', 'El perro parece estar muy asustado y herido.', 'Calle principal, Ciudad X', LOAD_FILE('D:\\alan.png'), NULL),
(2, 2, 2, 'Gato abandonado en parque', '2024-05-16', 'Gato doméstico de color negro', 'Un gato fue avistado en el parque, parece estar perdido y desorientado.', NULL, 'Parque Central, Ciudad Y', LOAD_FILE('/var/lib/mysql-files/alan.png'), NULL);

SELECT id_animal FROM Animal WHERE disponible_para_adopcion = TRUE;

SELECT * FROM Denuncia ORDER BY id_denuncia;

SELECT * FROM Seguimiento ORDER BY id_seguimiento;

SELECT * FROM Mascota ORDER BY id_mascota;

USE patitas_db;

SHOW VARIABLES LIKE "secure_file_priv";

INSERT INTO Mascota (id_usuario, id_animal) 
VALUES (8, 1);
