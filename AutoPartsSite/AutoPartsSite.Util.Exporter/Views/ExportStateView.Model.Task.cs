using AutoPartsSite.Util.Exporter.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoPartsSite.Util.Exporter.Views
{
    public partial class ExportStateViewModel
    {
        public class TaskExport 
        {
            private ExportCompanyAgreementModel expCAM;
            public TaskExport(ExportCompanyAgreementModel exp)
            {
                expCAM = exp;
            }

            public int State { get; set; }

            public void Run(Action<TaskExport> actionFinish)
            {
                State = 1;
                expCAM.Message = "Запуск...";
                Task.Run(() =>
                {
                    Task.Delay(1000);
                    expCAM.Message = "Выполнение...";

                    Task.Delay(5000);

                    State = 2;
                    expCAM.Message = "Завершено...";
                    actionFinish?.Invoke(this);
                });
            }
        }
    }
}
