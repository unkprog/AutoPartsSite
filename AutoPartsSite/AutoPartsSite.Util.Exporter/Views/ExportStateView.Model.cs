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
                    List<TaskExport> listItems = new List<TaskExport>(expItems.Count);
                    for (int i = expItems.Count - 1; i >= 0; i--)
                        listItems.Add(new TaskExport(expItems[i]));


                    int cntTasks = System.Environment.ProcessorCount * 2;
                    TaskExport task;
                    List<TaskExport> taskRunning = new List<TaskExport>(cntTasks);

                    while (listItems.Count > 0)
                    {
                        taskRunning.Clear();
                        for (int i = 0; i < listItems.Count && taskRunning.Count < cntTasks; i++)
                        {
                            task = listItems[i];
                            if (task.State == 0)
                            {
                                taskRunning.Add(task);
                                task.Run((taskFinish) => listItems.Remove(taskFinish));
                            }
                        }
                    }


                }
                MainWindowViewModel.This.IsDisable = false;
            });
        }
    }
}
