using ReactiveUI;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace AutoPartsSite.Util.Exporter.ViewModels
{
    public class MasterViewModel : ViewModelBase
    {
        public virtual string Header => string.Empty;
        public virtual string Description => string.Empty;


        public virtual bool Validate()
        {
            return true;
        }
    }

}
