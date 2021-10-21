-- en: Options
-- ru: Опции

if not exists (select * from [sys].[objects] where [object_id] = object_id(N'[Option]') and type in (N'U'))
begin
  create table [Option]
  (
	[Id]      [int]           not null,
	[Name]    [nvarchar](50)  not null default (N''),
	[Value]   [nvarchar](512) not null default (N''),
    primary key clustered ([Id])
  )
end

go

if exists(select * from [sys].[indexes] where [name] = 'option_idx_1')
  drop index [role_idx_1] on [Option]

go

create nonclustered index [option_idx_1] ON [Option] ([Name])

go

