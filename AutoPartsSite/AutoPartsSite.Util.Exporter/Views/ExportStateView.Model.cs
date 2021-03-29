using System.Linq;
using AutoPartsSite.Util.Exporter.Models;
using AutoPartsSite.Util.Exporter.ViewModels;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace AutoPartsSite.Util.Exporter.Views
{
    public partial class ExportStateViewModel : MasterViewModel
    {
        public void Setup(ObservableCollection<CompanyAgreementModel> companyAgreements)
        {
            ObservableCollection<ExportCompanyAgreementModel> items = new ObservableCollection<ExportCompanyAgreementModel>();
            foreach (var item in companyAgreements)
            {
                if(item.IsSelected == true)
                {
                    items.Add(new ExportCompanyAgreementModel() { CompanyAgreement = item });
                }
            }
            ExportCompanyAgreements = items;
            StartExport();
        }

        private void StartExport()
        {
            Task.Run(() =>
            {
                MainWindowViewModel.This.IsDisable = true;
                if (exportCompanyAgreements != null)
                {
                    var expItems = exportCompanyAgreements;
                    List<TaskExport> taskItems = new List<TaskExport>(expItems.Count);
                    for (int i = expItems.Count - 1; i >= 0; i--)
                        taskItems.Add(new TaskExport(MainWindowViewModel.This.Query!, expItems[i], (taskFinish) => taskItems.Remove(taskFinish)));

                    int countRun, cntTasks = 2; // System.Environment.ProcessorCount * 2, countRun;
                    TaskExport task;

                    while (taskItems.Count > 0)
                    {
                        countRun = 0;
                        for (int i = taskItems.Count - 1; i >= 0; i--)
                        {
                            task = null;
                            lock (taskItems)
                                if (i < taskItems.Count)
                                    task = taskItems[i];

                            if (task != null && task.State == 0)
                                task.Run();
                            countRun++;

                            if (countRun >= cntTasks)
                                break;
                        }
                    }
                }
                MainWindowViewModel.This.IsDisable = false;
            });
        }
    }
}
