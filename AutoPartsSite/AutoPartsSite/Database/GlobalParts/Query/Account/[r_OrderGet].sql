declare	@SiteCode nvarchar(20) = 'RETAIL'
declare @SiteID int = (select top 1 [SiteID] from dbo.GetSites(@LocaleLanguageID, 0, @SiteCode))


select * from [dbo].[r_OrderGet]
(
	@LocaleLanguageID ,	
	@SiteID,
	@SiteUserID,
	0, --@CustomerCompanyID int,
	0, --@CustomerAgreementID int,
	0, --@OurRetailCompanyID int,
	0, --@OurRetailAgreementID int,
	0, --@OrderNumber int,
	'', --@OrderNumberFull nvarchar(15),
	null, --@DateFrom datetime,
	null, --@DateTo datetime,
	0, --@DeliveryRouteID int,
	0, --@DeliveryTariffID int,
	0, --@DeliveryAddressID int,
	0, --@BillingAddressID int,
	0, --@OrderCurrencyID int,
	0, --@CartCurrencyID int,
	0, --@InvoiceCurrencyID int,
	'', --@Comment nvarchar(150),
	@OrderHeaderID
)
