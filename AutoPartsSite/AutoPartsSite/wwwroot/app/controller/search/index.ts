import vars = require('app/core/variables');
import base = require('app/core/basecontroller');

export namespace Controller.Search {
    export class Index extends base.Controller.Base {
        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/search/index.html", Id: "search-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$AutoPartsSite"),
                "labelAbout": vars._statres("label$aboutUs")
            });
        }

        protected createEvents(): void {
            let templateContent = this.View.find('#search-view-brand-catalogs-template').html();
            let items = [
                { BrandName: "BMW", BrandImage: "bmw.png" },
                { BrandName: "Chevrolet", BrandImage: "chevrolet.png" },
                { BrandName: "Honda", BrandImage: "honda.png" },
                { BrandName: "Hyundai", BrandImage: "hyundai.png" },
                { BrandName: "Infiniti", BrandImage: "infiniti.png" },
                { BrandName: "Isuzu", BrandImage: "isuzu.png" },
                { BrandName: "Kia", BrandImage: "kia.png" },
                { BrandName: "Land-Rover", BrandImage: "land-rover.png" },
                { BrandName: "Lexus", BrandImage: "lexus.png" },
                { BrandName: "Mazda", BrandImage: "mazda.png" },
                { BrandName: "Mercedes", BrandImage: "mercedes-benz.png" },
                { BrandName: "Mitsubishi", BrandImage: "mitsubishi.png" },
                { BrandName: "Nissan", BrandImage: "nissan.png" },
                { BrandName: "Peugeot", BrandImage: "peugeot.png" },
                { BrandName: "Porsche", BrandImage: "porsche.png" },
                { BrandName: "Renault", BrandImage: "renault.png" },
                { BrandName: "Subaru", BrandImage: "subaru.png" },
                { BrandName: "Suzuki", BrandImage: "suzuki.png" },
                { BrandName: "Toyota", BrandImage: "toyota.png" },
                { BrandName: "Volkswagen", BrandImage: "volkswagen.png" }
            ];

            let template = vars.getTemplate(templateContent);
            let htmlResult = '';
            for (let i = 0, icount = items.length; i < icount; i++)
                htmlResult = (htmlResult + template(items[i]));

            this.View.find('#search-view-brand-catalogs').html(htmlResult);
        }

        protected destroyEvents(): void {
            
        }
    }
}

vars.registerController("search/index", function (module: any): Interfaces.IController { return new module.Controller.Search.Index(); });