using Avalonia;
using Avalonia.Controls;
using Avalonia.Markup.Xaml;

namespace AutoPartsSite.Util.Exporter.Views
{
    public class SelectAgreementsView : UserControl
    {
        public SelectAgreementsView()
        {
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            AvaloniaXamlLoader.Load(this);
        }
    }
}
