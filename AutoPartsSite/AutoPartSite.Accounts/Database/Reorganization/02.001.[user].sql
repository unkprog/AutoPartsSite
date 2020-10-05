-- en: Users
-- ru: Пользователи

if not exists (select * from [sys].[objects] where [object_id] = object_id(N'[user]') and type in (N'U'))
begin
  create table [user]
  (
	[id]    [int]           identity(1,1) not null,
	[d]     [int]           not null default (0),
	[cd]    [datetime]      not null default (getdate()),
	[cu]    [int]           not null default (0),
	[ud]    [datetime]      not null default (getdate()),
	[uu]    [int]           not null default (0),
	[email] [nvarchar](112) not null default (N''),
    primary key clustered ([id])
  )
end

go

if exists(select * from [sys].[indexes] where [name] = 'user_idx_1')
  drop index [user_idx_1] on [user]

go

create unique nonclustered index [pos_user_idx_1] ON [user] ([email])

go

if not exists (select * from [sys].[objects] where [object_id] = object_id(N'[user_sec]') and type in (N'U'))
begin
  create table [user_sec]
  (
	[id]   [int]          not null,
	[pass] [nvarchar](50) not null default (N''),
    primary key clustered ([id])
  )
end

go

if not exists (select * from [sys].[objects] where [object_id] = object_id(N'[user_role]') and type in (N'U'))
begin
  create table [user_role]
  (
	[id]   [int] identity(1,1) not null,
	[user] [int] not null default (0),
	[role] [int] not null default (0),
    primary key clustered ([id])
  )
end

go


if exists(select * from [sys].[indexes] where [name] = 'user_role_idx_1')
  drop index [user_role_idx_1] on [user_role]

go

create nonclustered index [user_role_idx_1] ON [user_role] ([user])


go


