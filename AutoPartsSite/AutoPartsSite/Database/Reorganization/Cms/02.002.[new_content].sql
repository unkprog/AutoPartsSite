-- en: New - content
-- ru: Новость - содержимое

if not exists (select * from [sys].[objects] where [object_id] = object_id(N'[New_Content]') and type in (N'U'))
begin
  create table [New_Content]
  (
	[Id]      [int]              not null default (0),
	[Index]   [int]              not null default (0),
	[ContentEn] [nvarchar](4000) not null default (N''),
	[ContentRu] [nvarchar](4000) not null default (N''),
	primary key clustered ([Id],[Index])
  )
end
