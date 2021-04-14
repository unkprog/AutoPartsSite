select [t].[Code], [t].[IsCatalogSearch]
from (values('AC DELCO', 0), ('CHRYSLER', 1), ('DODGE', 1), ('JEEP', 1), ('DAIHATSU', 0)
          , ('GM', 0), ('HINO', 0), ('HONDA', 1), ('HYUNDAI', 1), ('ISUZU', 1), ('KIA', 1)
          , ('MAZDA', 1), ('MITSUBISHI', 1), ('NISSAN', 1), ('INFINITY', 0), ('RENAULT', 1)
          , ('SUBARU', 1), ('SUZUKI', 1), ('SUZUKI MOTO', 0), ('TOYOTA', 1), ('LEXUS', 1)
          , ('TOYOTA FORKLIFT', 0), ('VOLVO', 1), ('YAMAHA', 0)) [t]([Code], [IsCatalogSearch])
left join [Brands] [b] with(nolock) on [t].[Code] = [b].[Code]
order by [t].[Code]