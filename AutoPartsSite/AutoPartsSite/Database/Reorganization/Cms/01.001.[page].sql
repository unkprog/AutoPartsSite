-- en: Page
-- ru: Страница

if not exists (select * from [sys].[objects] where [object_id] = object_id(N'[Page]') and type in (N'U'))
begin
  create table [Page]
  (
	[Id]   [int]            identity(1,1) not null,
	[Page] [nvarchar](1000) not null default (N''),
	primary key clustered ([Id])
  )
end

go

if exists(select * from [sys].[indexes] where [name] = 'page_idx_1')
  drop index [page_idx_1] on [Page]

go

create nonclustered index [page_idx_1] ON [Page] ([Page])


