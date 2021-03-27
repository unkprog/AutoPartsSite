using AutoPartsSite.Util.Exporter.ViewModels;
using ReactiveUI;
using System.Runtime.Serialization;

namespace AutoPartsSite.Util.Exporter.Models
{

    [DataContract]
    public partial class ConnectModel : ViewModelBase
    {
        private string dataSource = ".";
        private bool isSSPI = true;
        private string userID = string.Empty;
        private string password = string.Empty;
        private string initialCatalog = "GlobalParts";

        [DataMember]
        public string DataSource { get => dataSource; set => this.RaiseAndSetIfChanged(ref dataSource, value); }
        [DataMember]
        public bool IsSSPI { get => isSSPI; set => this.RaiseAndSetIfChanged(ref isSSPI, value); }
        [DataMember]
        public string UserID { get => userID; set => this.RaiseAndSetIfChanged(ref userID, value); }
        [DataMember]
        public string Password { get => password; set => this.RaiseAndSetIfChanged(ref password, value); }
        [DataMember]
        public string InitialCatalog { get => initialCatalog; set => this.RaiseAndSetIfChanged(ref initialCatalog, value); }
    }
}
