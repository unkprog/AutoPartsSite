using AutoPartsSite.Util.Exporter.ViewModels;
using Avalonia.Controls;
using Avalonia.Controls.Templates;
using System;

namespace AutoPartsSite.Util.Exporter
{
    public class ViewLocator : IDataTemplate
    {
        public bool SupportsRecycling => false;

        public IControl Build(object data)
        {
            //var name = data.GetType().FullName!.Replace("ViewModel", "View");
            var name = data.GetType().FullName;
#pragma warning disable CS8602 // –азыменование веро€тной пустой ссылки.
            name = name.Replace("Model", string.Empty);
#pragma warning restore CS8602 // –азыменование веро€тной пустой ссылки.

            var type = Type.GetType(name);

            if (type != null)
            {
                return (Control)Activator.CreateInstance(type)!;
            }
            else
            {
                return new TextBlock { Text = "Not Found: " + name };
            }
        }

        public bool Match(object data)
        {
            return data is ViewModelBase;
        }

    }
}
