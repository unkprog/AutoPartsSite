-- en: Users
-- ru: Пользователи

if not exists (select * from [sys].[objects] where [object_id] = object_id(N'[User]') and type in (N'U'))
begin
  create table [User]
  (
	[Id]    [int]           identity(1,1) not null,
	[D]     [int]           not null default (0),
	[Cd]    [datetime]      not null default (getdate()),
	[Cu]    [int]           not null default (0),
	[Ud]    [datetime]      not null default (getdate()),
	[Uu]    [int]           not null default (0),
	[Email] [nvarchar](112) not null default (N''),
    primary key clustered ([Id])
  )
end

go

if exists(select * from [sys].[indexes] where [name] = 'user_idx_1')
  drop index [user_idx_1] on [User]

go

create unique nonclustered index [pos_user_idx_1] ON [User] ([Email])

go

if not exists (select * from [sys].[objects] where [object_id] = object_id(N'[User_Sec]') and type in (N'U'))
begin
  create table [User_Sec]
  (
	[Id]   [int]           not null,
	[Pass] [nvarchar](512) not null default (N''),
    primary key clustered ([Id])
  )
end

go

if not exists (select * from [sys].[objects] where [object_id] = object_id(N'[User_Role]') and type in (N'U'))
begin
  create table [User_Role]
  (
	[Id]   [int] identity(1,1) not null,
	[User] [int] not null default (0),
	[Role] [int] not null default (0),
    primary key clustered ([Id])
  )
end

go


if exists(select * from [sys].[indexes] where [name] = 'user_role_idx_1')
  drop index [user_role_idx_1] on [User_Role]

go

create nonclustered index [user_role_idx_1] ON [User_Role] ([User])


go


