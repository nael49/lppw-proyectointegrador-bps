-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-11-2022 a las 01:12:49
-- Versión del servidor: 10.4.25-MariaDB
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `cortocircuito`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargo fijo`
--

CREATE TABLE `cargo fijo` (
  `id_cargo` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `dni` int(10) NOT NULL,
  `nombrecompleto` varchar(50) NOT NULL,
  `celular` int(15) NOT NULL,
  `direccion` varchar(50) NOT NULL,
  `email` varchar(60) NOT NULL,
  `localidad` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`dni`, `nombrecompleto`, `celular`, `direccion`, `email`, `localidad`) VALUES
(7645903, 'nelson lautaro sepulveda', 1256879045, 'calle falsa 123', 'asdr@gmail.com', 'sprindfield'),
(12345652, 'nelson sepulveda', 1585749623, 'calle falsa 123', 'asdr@gmail.com', 'sprindfield'),
(35122245, 'asdasd asdsad', 2147483647, 'lasheras fdsdfsd', 'nelsonlautarosepulveda@gmail.com', 'ezeiza asdas'),
(35122292, 'asdsad asdasd', 2147483647, 'lasheras fdsdfsd', 'nelsonlautarosepulveda@gmail.com', 'ezeiza asdas'),
(35122565, 'asdasd asdsad', 2147483647, 'lasheras fdsdfsd', 'nelsonlautarosepulveda@gmail.com', 'ezeiza '),
(35122567, 'asdasd asdsad', 2147483647, 'lasheras fdsdfsd', 'nelsonlautarosepulveda@gmail.com', 'ezeiza asdas'),
(37125456, 'manuel ojeda', 1598364527, 'calle falsa 123', 'manuel@gmail.com', 'sprindfield'),
(89562347, 'riquelme ortiz', 345678091, 'las 213', 'nelson@gmail.com', 'sadsad');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados`
--

CREATE TABLE `estados` (
  `id_estados` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `estados`
--

INSERT INTO `estados` (`id_estados`, `nombre`) VALUES
(1, 'Cancelado'),
(2, 'En Espera'),
(3, 'En Revision'),
(4, 'En Reparacion'),
(5, 'Reparado'),
(6, 'Finalizado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marca`
--

CREATE TABLE `marca` (
  `id_marca` int(11) NOT NULL,
  `marca` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `marca`
--

INSERT INTO `marca` (`id_marca`, `marca`) VALUES
(1, 'samsung'),
(2, 'lg'),
(24, 'noblex'),
(25, 'patito'),
(26, 'electric');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modelo`
--

CREATE TABLE `modelo` (
  `id_modelo` int(11) NOT NULL,
  `modelo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `modelo`
--

INSERT INTO `modelo` (`id_modelo`, `modelo`) VALUES
(1, 'a20'),
(2, 'lg'),
(21, 'asd-04'),
(22, '55 mho'),
(23, '104-8 20w');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id` int(11) NOT NULL,
  `de` varchar(50) NOT NULL,
  `para` varchar(50) NOT NULL,
  `tipo` varchar(150) NOT NULL,
  `leido` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`id`, `de`, `para`, `tipo`, `leido`, `fecha`) VALUES
(1, '123456123', 'TECNICO', 'Se a Creado una nueva orden para un: celular con: cambio de bateria', 0, '2022-11-12 00:12:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden_trabajo`
--

CREATE TABLE `orden_trabajo` (
  `id_orden` int(11) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fecha_retiro` date DEFAULT NULL,
  `hora_inicio` datetime DEFAULT NULL,
  `hora_fin` datetime DEFAULT NULL,
  `fk_repuestos` int(11) DEFAULT NULL,
  `fk_tecnico` int(11) DEFAULT NULL,
  `fk_recepcionista` int(11) DEFAULT NULL,
  `fk_cliente` int(11) DEFAULT NULL,
  `estado` int(11) NOT NULL,
  `descripcion_falla` varchar(250) NOT NULL,
  `datos_importantes` varchar(300) DEFAULT NULL,
  `pago` int(11) NOT NULL,
  `fk_tipo_equipo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `orden_trabajo`
--

INSERT INTO `orden_trabajo` (`id_orden`, `fecha_creacion`, `fecha_retiro`, `hora_inicio`, `hora_fin`, `fk_repuestos`, `fk_tecnico`, `fk_recepcionista`, `fk_cliente`, `estado`, `descripcion_falla`, `datos_importantes`, `pago`, `fk_tipo_equipo`) VALUES
(2, '2022-11-08 21:35:40', NULL, '2022-11-02 18:24:20', '2022-11-05 19:49:10', NULL, 35122299, 123456123, 35122245, 5, 'pantalla rota', 'tv samsung', 1, 2),
(4, '2022-11-08 23:18:30', NULL, '2022-09-01 20:49:51', '2022-09-14 22:51:26', NULL, 56789328, 123456123, 7645903, 5, 'no emite sonido', 'hisense 55\' h-dfghh2155. x1 pantalla x2 resistencia x1 tira led', 20, 2),
(5, '2022-11-08 21:35:52', NULL, '2022-11-02 21:55:12', '2022-11-05 20:49:38', NULL, 35122299, 123456123, 12345652, 5, 'no carga la bateria', 'noblex  a-345, 4gb ram 128 disco diro', 2000, 3),
(6, '2022-11-11 21:05:34', NULL, NULL, NULL, NULL, NULL, 123456123, 37125456, 2, 'la pantalla \"pixelea\" las imagenes', 'LG 43\" L4220ARJ', 0, 2),
(7, '2022-11-12 00:08:41', NULL, NULL, NULL, NULL, NULL, 123456123, 89562347, 2, 'cambio de bateria', 'Samsung A-33 ', 0, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `repuestos`
--

CREATE TABLE `repuestos` (
  `id_repuesto` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `distribuidor` varchar(50) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio` int(11) NOT NULL,
  `descripcion` varchar(60) DEFAULT NULL,
  `fk_marca` int(11) NOT NULL,
  `fk_modelo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `repuestos`
--

INSERT INTO `repuestos` (`id_repuesto`, `nombre`, `distribuidor`, `cantidad`, `precio`, `descripcion`, `fk_marca`, `fk_modelo`) VALUES
(8, 'pantalla', 'tex .s.a   ', 13, 61, ' pantalla para samsung s20', 1, 1),
(32, 'pin de carga', 'asdasd sadsadsa sadsad', 11, 11, 'asdasdasd', 24, 21),
(34, 'resistencia ', 'mercado libre s.a', 99, 1, 'resistencia 55mohs', 25, 22),
(35, 'tira led para televisor', 'electric s.a', 10, 2000, 'tira led para televisores de 43\"', 26, 23);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `repuestos_orden`
--

CREATE TABLE `repuestos_orden` (
  `id` int(11) NOT NULL,
  `fk_orden` int(11) NOT NULL,
  `fk_repuesto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `repuestos_orden`
--

INSERT INTO `repuestos_orden` (`id`, `fk_orden`, `fk_repuesto`) VALUES
(3, 2, 32),
(4, 5, 8),
(5, 5, 32),
(6, 4, 8),
(7, 4, 34),
(8, 4, 35);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_equipo`
--

CREATE TABLE `tipo_equipo` (
  `id_tipo` int(11) NOT NULL,
  `tipo_equipo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tipo_equipo`
--

INSERT INTO `tipo_equipo` (`id_tipo`, `tipo_equipo`) VALUES
(1, 'pc'),
(2, 'tv'),
(3, 'notebook'),
(4, 'celular');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_general`
--

CREATE TABLE `usuarios_general` (
  `dni` int(11) NOT NULL,
  `nombrecompleto` varchar(50) NOT NULL,
  `fecha_inicio` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `puesto` varchar(50) NOT NULL,
  `estado` int(11) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `direccion` varchar(50) NOT NULL,
  `localidad` varchar(50) NOT NULL,
  `celular` int(11) NOT NULL,
  `pass` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios_general`
--

INSERT INTO `usuarios_general` (`dni`, `nombrecompleto`, `fecha_inicio`, `puesto`, `estado`, `email`, `direccion`, `localidad`, `celular`, `pass`) VALUES
(12312123, 'juan pedro', '2022-11-05 15:12:32', 'ADMIN', 1, 'asdr@gmail.com', 'calle falsa 568', 'sprindfield', 1231231254, '1234'),
(12345678, 'adasdasd asdasdas', '2022-11-05 15:11:23', 'GERENTE', 1, 'nelson@gmail.com', 'las 213', 'sadsad', 12121212, '1234'),
(35122299, 'nelson', '2022-11-05 15:11:23', 'TECNICO', 1, 'NELSON@GMAIL.COM', 'SPEGA 123', 'SPEGA', 1558122345, '1234'),
(56789328, 'osvaldo asd', '2022-11-08 23:18:10', 'TECNICO', 1, 'luca@gmail.com', 'corrientes 2345', 'palermo CF', 1265456523, '1234'),
(85741963, 'admin deposito', '2022-11-05 15:11:23', 'ADMINISTRADOR_DE_DEPOSITO', 1, 'shdfkjbdssad123@gmail.com', 'calle falsa 321', 'monte grande', 12345678, '1234'),
(123456123, 'adasdasd asdasdas', '2022-11-05 15:11:23', 'RECEPCIONISTA', 1, 'asdr@gmail.com', 'calle falsa 123', 'sprindfield', 1512345216, '1234');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cargo fijo`
--
ALTER TABLE `cargo fijo`
  ADD PRIMARY KEY (`id_cargo`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`dni`);

--
-- Indices de la tabla `estados`
--
ALTER TABLE `estados`
  ADD PRIMARY KEY (`id_estados`);

--
-- Indices de la tabla `marca`
--
ALTER TABLE `marca`
  ADD PRIMARY KEY (`id_marca`);

--
-- Indices de la tabla `modelo`
--
ALTER TABLE `modelo`
  ADD PRIMARY KEY (`id_modelo`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `orden_trabajo`
--
ALTER TABLE `orden_trabajo`
  ADD PRIMARY KEY (`id_orden`),
  ADD KEY `fk_repuestos` (`fk_repuestos`),
  ADD KEY `fk_tecnico` (`fk_tecnico`),
  ADD KEY `fk_recepcionista` (`fk_recepcionista`),
  ADD KEY `fk_cliente` (`fk_cliente`),
  ADD KEY `estado` (`estado`),
  ADD KEY `fk_modelo` (`fk_tipo_equipo`);

--
-- Indices de la tabla `repuestos`
--
ALTER TABLE `repuestos`
  ADD PRIMARY KEY (`id_repuesto`),
  ADD KEY `fk_marca` (`fk_marca`),
  ADD KEY `fk_modelo` (`fk_modelo`);

--
-- Indices de la tabla `repuestos_orden`
--
ALTER TABLE `repuestos_orden`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_orden` (`fk_orden`),
  ADD KEY `fk_repuesto` (`fk_repuesto`);

--
-- Indices de la tabla `tipo_equipo`
--
ALTER TABLE `tipo_equipo`
  ADD PRIMARY KEY (`id_tipo`);

--
-- Indices de la tabla `usuarios_general`
--
ALTER TABLE `usuarios_general`
  ADD PRIMARY KEY (`dni`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cargo fijo`
--
ALTER TABLE `cargo fijo`
  MODIFY `id_cargo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estados`
--
ALTER TABLE `estados`
  MODIFY `id_estados` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `marca`
--
ALTER TABLE `marca`
  MODIFY `id_marca` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `modelo`
--
ALTER TABLE `modelo`
  MODIFY `id_modelo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `orden_trabajo`
--
ALTER TABLE `orden_trabajo`
  MODIFY `id_orden` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `repuestos`
--
ALTER TABLE `repuestos`
  MODIFY `id_repuesto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `repuestos_orden`
--
ALTER TABLE `repuestos_orden`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `tipo_equipo`
--
ALTER TABLE `tipo_equipo`
  MODIFY `id_tipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `orden_trabajo`
--
ALTER TABLE `orden_trabajo`
  ADD CONSTRAINT `orden_trabajo_ibfk_3` FOREIGN KEY (`fk_cliente`) REFERENCES `clientes` (`dni`) ON UPDATE CASCADE,
  ADD CONSTRAINT `orden_trabajo_ibfk_5` FOREIGN KEY (`fk_recepcionista`) REFERENCES `usuarios_general` (`dni`) ON UPDATE CASCADE,
  ADD CONSTRAINT `orden_trabajo_ibfk_6` FOREIGN KEY (`estado`) REFERENCES `estados` (`id_estados`) ON UPDATE CASCADE,
  ADD CONSTRAINT `orden_trabajo_ibfk_7` FOREIGN KEY (`fk_tipo_equipo`) REFERENCES `tipo_equipo` (`id_tipo`) ON UPDATE CASCADE,
  ADD CONSTRAINT `orden_trabajo_ibfk_8` FOREIGN KEY (`fk_tecnico`) REFERENCES `usuarios_general` (`dni`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `repuestos`
--
ALTER TABLE `repuestos`
  ADD CONSTRAINT `repuestos_ibfk_1` FOREIGN KEY (`fk_marca`) REFERENCES `marca` (`id_marca`) ON UPDATE CASCADE,
  ADD CONSTRAINT `repuestos_ibfk_2` FOREIGN KEY (`fk_modelo`) REFERENCES `modelo` (`id_modelo`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `repuestos_orden`
--
ALTER TABLE `repuestos_orden`
  ADD CONSTRAINT `repuestos_orden_ibfk_2` FOREIGN KEY (`fk_repuesto`) REFERENCES `repuestos` (`id_repuesto`) ON UPDATE CASCADE,
  ADD CONSTRAINT `repuestos_orden_ibfk_3` FOREIGN KEY (`fk_orden`) REFERENCES `orden_trabajo` (`id_orden`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
