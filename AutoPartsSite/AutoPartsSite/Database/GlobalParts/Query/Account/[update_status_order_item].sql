declare @CreateDate datetime = getdate()

exec [dbo].[r_OrderItemStatusUpdate] 
	  @LocaleLanguageID --int,
	, @CrudType --int, -- 1- Create, 2- Update
	, @CreateDate --datetime,
	, @OrderHeaderID --int,
	, @OrderItemID --int,
	, @StatusID --int,
	, @OrderItemStatusID --int,
	, @Comment --nvarchar(255)