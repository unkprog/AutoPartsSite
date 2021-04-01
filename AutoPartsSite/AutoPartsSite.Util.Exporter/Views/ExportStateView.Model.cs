using System.Linq;
using AutoPartsSite.Util.Exporter.Models;
using AutoPartsSite.Util.Exporter.ViewModels;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Threading;

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

        private static object locker = new object();

        public static int GetStableHashCode(string str)
        {
            unchecked
            {
                int hash1 = 5381;
                int hash2 = hash1;

                for (int i = 0; i < str.Length && str[i] != '\0'; i += 2)
                {
                    hash1 = ((hash1 << 5) + hash1) ^ str[i];
                    if (i == str.Length - 1 || str[i + 1] == '\0')
                        break;
                    hash2 = ((hash2 << 5) + hash2) ^ str[i + 1];
                }

                return hash1 + (hash2 * 1566083941);
            }
        }

        private void StartExport()
        {
            Task.Run(() =>
            {
                MainWindowViewModel.This.IsDisable = true;
                if (exportCompanyAgreements != null)
                {
                    var expItems = exportCompanyAgreements;
                    int countRun, cntTasks = System.Environment.ProcessorCount * 2;
                    List<TaskExport> taskItems = new List<TaskExport>(expItems.Count);
                    TaskExport? task;

                    for (int i = expItems.Count - 1; i >= 0; i--)
                    {
                        task = new TaskExport(MainWindowViewModel.This.Query!, expItems[i], (taskFinish) =>
                        {
                            lock (locker)
                            {
                                taskItems.Remove(taskFinish);
                            }
                        });
                        expItems[i].Message = "Проверка и создание индекса [PricesCustomersInside_idx_split]";
                        taskItems.Add(task);
                        Thread.Sleep(10);
                    }

                    MainWindowViewModel.This.Query!.ExecuteNonQuery("[brands_split_index]", null, cmdTimeOut: 300);

                    string selColumnsIndex;
                    for (int i = taskItems.Count - 1; i >= 0; i--)
                    {
                        taskItems[i].Prepare();
                        selColumnsIndex = taskItems[i].GetSqlCommandIndex();
                        if (!string.IsNullOrEmpty(selColumnsIndex))
                        {
                            string hashValue = GetStableHashCode(selColumnsIndex).ToString().Replace("-", "minus");
                            selColumnsIndex = "if not exists(select * from [sys].[indexes] where [name] = 'PricesCustomersInside_idx_" + hashValue + "') "
                                            + " create nonclustered index [PricesCustomersInside_idx_" + hashValue + "] on [dbo].[PricesCustomersInside] ([CurrencyID],[StockQty]) include (" + selColumnsIndex + ")";
                            expItems[i].Message = "Проверка и создание индекса [PricesCustomersInside_idx_" + hashValue + "]";
                            MainWindowViewModel.This.Query!.ExecuteQuery(selColumnsIndex, null, null, (values) => { }, cmdTimeOut: 300);
                        }
                        expItems[i].Message = "Ожидание выполнения...";
                        Thread.Sleep(10);
                    }

                    while (taskItems.Count > 0)
                    {
                        countRun = 0;
                        for (int i = taskItems.Count - 1; i >= 0; i--)
                        {
                            task = null;
                            lock (locker)
                            {
                                if (i < taskItems.Count)
                                    task = taskItems[i];
                            }

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
