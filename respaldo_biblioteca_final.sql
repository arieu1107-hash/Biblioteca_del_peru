USE [Biblioteca]
GO

-- =============================================
-- TABLA: Libros
-- =============================================
CREATE TABLE [dbo].[Libros](
    [id]         [int] IDENTITY(1,1) NOT NULL,
    [titulo]     [varchar](255)      NULL,
    [autor]      [varchar](255)      NULL,
    [disponible] [bit]               NULL,
    [imagen_url] [varchar](max)      NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

-- =============================================
-- TABLA: usuarios
-- =============================================
CREATE TABLE [dbo].[usuarios](
    [id]             [int] IDENTITY(1,1) NOT NULL,
    [nombre]         [varchar](100)  NOT NULL,
    [apellido]       [varchar](100)  NOT NULL,
    [email]          [varchar](150)  NOT NULL,
    [password]       [varchar](255)  NOT NULL,
    [rol]            [varchar](50)   NULL,
    [activo]         [bit]           NULL,
    [fecha_registro] [datetime]      NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]
GO

-- =============================================
-- TABLA: Reservas (NUEVA)
-- =============================================
CREATE TABLE [dbo].[Reservas](
    [id]               [int] IDENTITY(1,1) NOT NULL,
    [usuario_id]       [int]       NOT NULL,
    [libro_id]         [int]       NOT NULL,
    [fecha_reserva]    [datetime]  NULL,
    [fecha_devolucion] [datetime]  NULL,
    [estado]           [varchar](50) NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    FOREIGN KEY ([usuario_id]) REFERENCES [dbo].[usuarios]([id]),
    FOREIGN KEY ([libro_id])   REFERENCES [dbo].[Libros]([id])
) ON [PRIMARY]
GO

-- =============================================
-- VALORES POR DEFECTO
-- =============================================
ALTER TABLE [dbo].[Libros]   ADD DEFAULT ((1))        FOR [disponible]
ALTER TABLE [dbo].[usuarios] ADD DEFAULT ('Lector')   FOR [rol]
ALTER TABLE [dbo].[usuarios] ADD DEFAULT ((1))        FOR [activo]
ALTER TABLE [dbo].[usuarios] ADD DEFAULT (getdate())  FOR [fecha_registro]
ALTER TABLE [dbo].[Reservas] ADD DEFAULT (getdate())  FOR [fecha_reserva]
ALTER TABLE [dbo].[Reservas] ADD DEFAULT ('Activa')   FOR [estado]
GO

-- =============================================
-- ÍNDICE ÚNICO: email de usuario
-- =============================================
ALTER TABLE [dbo].[usuarios] ADD UNIQUE ([email])
GO

-- =============================================
-- DATOS DE PRUEBA: Libros
-- =============================================
SET IDENTITY_INSERT [dbo].[Libros] ON
INSERT [dbo].[Libros] ([id],[titulo],[autor],[disponible],[imagen_url]) VALUES (14, N'Mitos, Leyendas y Cuentos Peruanos',       N'José María Arguedas',       1, N'https://m.media-amazon.com/images/I/91SAnS8-MOL.jpg')
INSERT [dbo].[Libros] ([id],[titulo],[autor],[disponible],[imagen_url]) VALUES (15, N'Tradiciones Peruanas',                      N'Ricardo Palma',             1, N'https://i.scdn.co/image/ab6765630000ba8a45b7dc19c3d3db8bf683036f')
INSERT [dbo].[Libros] ([id],[titulo],[autor],[disponible],[imagen_url]) VALUES (16, N'El Caballero Carmelo',                      N'Abraham Valdelomar',        1, N'https://www.elvirrey.com/imagenes/9786123/978612305056.GIF')
INSERT [dbo].[Libros] ([id],[titulo],[autor],[disponible],[imagen_url]) VALUES (17, N'Cuentos Andinos',                           N'Enrique López Albújar',     1, N'https://www.elvirrey.com/imagenes/9786123/978612305222.GIF')
INSERT [dbo].[Libros] ([id],[titulo],[autor],[disponible],[imagen_url]) VALUES (18, N'Los Comentarios Reales',                    N'Inca Garcilaso de la Vega', 1, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDOEz4aBnT7Po8QjJUIEVCewEp1quIoOGVGg&s')
INSERT [dbo].[Libros] ([id],[titulo],[autor],[disponible],[imagen_url]) VALUES (19, N'La Leyenda de Manco Cápac y Mama Ocllo',    N'Anónimo',                   1, N'https://www.editorialbruno.com.pe/bstore/1170/manco-capac-y-mama-ocllo.jpg')
INSERT [dbo].[Libros] ([id],[titulo],[autor],[disponible],[imagen_url]) VALUES (20, N'El Mito de Naylamp',                        N'Cultura Lambayeque',        1, N'https://secretosenlahistoriablog.wordpress.com/wp-content/uploads/2015/06/naylamp-balsa.jpg?w=640')
INSERT [dbo].[Libros] ([id],[titulo],[autor],[disponible],[imagen_url]) VALUES (21, N'La Jarjacha',                               N'Leyenda Popular',           1, N'https://static.wikia.nocookie.net/mitologa/images/6/6e/Jarjacha2.0.0.5.56472.jpg/revision/latest?cb=20210103013419&path-prefix=es')
INSERT [dbo].[Libros] ([id],[titulo],[autor],[disponible],[imagen_url]) VALUES (22, N'El Tunche',                                 N'Mito de la Selva',          1, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7TlcHVyIXOG8EddoGiswxyu_7CdzQ_Z7vyw&s')
INSERT [dbo].[Libros] ([id],[titulo],[autor],[disponible],[imagen_url]) VALUES (23, N'Dioses y Hombres de Huarochirí',             N'Francisco de Ávila',        1, N'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz3GFEW_nzA4NDOWZRL5lZa6bTYFKvab2W8g&s')
INSERT [dbo].[Libros] ([id],[titulo],[autor],[disponible],[imagen_url]) VALUES (24, N'Los Perros Hambrientos',                    N'Ciro Alegría',              1, N'https://c8.alamy.com/comp/P6DBT1/alegria-ciro-escritor-peruano-1909-1967-portada-de-su-obra-los-perros-hambrientos-P6DBT1.jpg')
INSERT [dbo].[Libros] ([id],[titulo],[autor],[disponible],[imagen_url]) VALUES (25, N'El Muqui',                                  N'Leyenda Minera',            1, N'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/H3QXMOAPGZGFRJY2LTLRNYN4GU.jpg')
INSERT [dbo].[Libros] ([id],[titulo],[autor],[disponible],[imagen_url]) VALUES (26, N'La Pishtaca',                               N'Leyenda de la Sierra',      1, N'https://imgv2-2-f.scribdassets.com/img/document/493092626/original/75fc33e1cb/1?v=1')
INSERT [dbo].[Libros] ([id],[titulo],[autor],[disponible],[imagen_url]) VALUES (27, N'Mitos, Leyendas y Cuentos Peruanos (Ed.2)', N'José María Arguedas',       1, N'https://images.cdn2.buscalibre.com/fit-in/360x360/ed/56/ed5614f3655790722c8a9aa0276fc5fe.jpg')
INSERT [dbo].[Libros] ([id],[titulo],[autor],[disponible],[imagen_url]) VALUES (28, N'La zorrita especial de Renzo',              N'Huerta Moreno Ariel',       1, NULL)
SET IDENTITY_INSERT [dbo].[Libros] OFF
GO

-- =============================================
-- DATOS DE PRUEBA: Usuarios
-- =============================================
SET IDENTITY_INSERT [dbo].[usuarios] ON
INSERT [dbo].[usuarios] ([id],[nombre],[apellido],[email],[password],[rol],[activo],[fecha_registro]) VALUES (1,  N'Renza', N'Romana', N'sorrita22222@gmail.com', N'123456789', N'Lector',        1, CAST(N'2026-04-08T10:44:39.403' AS DateTime))
INSERT [dbo].[usuarios] ([id],[nombre],[apellido],[email],[password],[rol],[activo],[fecha_registro]) VALUES (13, N'Riki',  N'Huerta', N'arieu1107@gmail.com',    N'123456789', N'Administrador', 1, CAST(N'2026-04-08T10:53:47.950' AS DateTime))
SET IDENTITY_INSERT [dbo].[usuarios] OFF
GO
