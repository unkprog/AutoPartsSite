-- en: Page - content
-- ru: Страница - содержимое

if not exists (select * from [sys].[objects] where [object_id] = object_id(N'[Page_Content]') and type in (N'U'))
begin
  create table [Page_Content]
  (
	[Id]      [int]              not null default (0),
	[Index]   [int]              not null default (0),
	[ContentEn] [nvarchar](4000) not null default (N''),
	[ContentRu] [nvarchar](4000) not null default (N''),
	primary key clustered ([Id],[Index])
  )
end
