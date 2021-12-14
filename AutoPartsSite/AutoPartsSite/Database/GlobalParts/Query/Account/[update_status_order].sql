declare @CreateDate datetime = getdate()

exec [dbo].[r_OrderHeaderStatusUpdate] 
	  @LocaleLanguageID --int,
	, @CrudType --int, -- 1- Create, 2- Update
	, @CreateDate --datetime,
	, @OrderHeaderID --int,
	, @StatusID --int,
	, @OrderHeaderStatusID --int,
	, @Comment --nvarchar(255)