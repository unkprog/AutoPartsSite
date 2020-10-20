-- en: New
-- ru: Новость

if not exists (select * from [sys].[objects] where [object_id] = object_id(N'[New]') and type in (N'U'))
begin
  create table [New]
  (
	[Id]          [int]           identity(1,1) not null,
	[ReleaseDate] [datetime]      not null default (getdate()),
	[HeaderEn]    [nvarchar](500) not null default (N''),
	[HeaderRu]    [nvarchar](500) not null default (N''),
	primary key clustered ([Id])
  )
end

go

if exists(select * from [sys].[indexes] where [name] = 'new_idx_1')
  drop index [new_idx_1] on [New]

go

create nonclustered index [new_idx_1] ON [New] ([ReleaseDate], [Id])


