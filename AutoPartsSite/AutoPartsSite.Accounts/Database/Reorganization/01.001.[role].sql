-- en: Roles
-- ru: Роли

if not exists (select * from [sys].[objects] where [object_id] = object_id(N'[Role]') and type in (N'U'))
begin
  create table [Role]
  (
	[Id]      [int]          not null,
	[Name]    [nvarchar](50) not null default (N''),
	[Options] [int]          not null default (0),
    primary key clustered ([Id])
  )
end

go

if exists(select * from [sys].[indexes] where [name] = 'role_idx_1')
  drop index [role_idx_1] on [Role]

go

create nonclustered index [role_idx_1] ON [Role] ([Name])

go

if not exists (select [Id] from [Role] where [Id] = 1) insert into [Role]([Id], [Name], [Options]) values(1, 'Administrator', 1) else update [Role] set [Name] = 'Administrator', [Options] = 1 where [Id] = 1
if not exists (select [Id] from [Role] where [Id] = 2) insert into [Role]([Id], [Name], [Options]) values(2, 'Client', 2)        else update [Role] set [Name] = 'Client'       , [Options] = 2 where [Id] = 2
 

