-- en: Roles
-- ru: Роли

if not exists (select * from [sys].[objects] where [object_id] = object_id(N'[role]') and type in (N'U'))
begin
  create table [role]
  (
	[id]      [int]          not null,
	[name]    [nvarchar](50) not null default (N''),
	[options] [int]          not null default (0),
    primary key clustered ([id])
  )
end

go

if exists(select * from [sys].[indexes] where [name] = 'role_idx_1')
  drop index [role_idx_1] on [role]

go

create nonclustered index [role_idx_1] ON [role] ([name])

go

if not exists (select [id] from [role] where [id] = 1) insert into [role]([id], [name], [options]) values(1, 'Administrator', 1) else update [role] set [name] = 'Administrator', [options] = 1 where [id] = 1
if not exists (select [id] from [role] where [id] = 2) insert into [role]([id], [name], [options]) values(2, 'Client', 2)        else update [role] set [name] = 'Client'       , [options] = 2 where [id] = 2
 

