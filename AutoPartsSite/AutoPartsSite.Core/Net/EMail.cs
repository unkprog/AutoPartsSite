using System.Net.Mail;

namespace AutoPartsSite.Core.Net
{
    public static class EMail
    {
        public static void SendEMail(string smtpHost, int smtpPort, string fromEmail, string password, string toAddress, string subject, string body)
        {
            using (MailMessage myMail = new MailMessage())
            {
                myMail.From = new MailAddress(fromEmail);
                myMail.To.Add(toAddress);
                myMail.Subject = subject;
                myMail.IsBodyHtml = true;
                myMail.Body = body;

                using (SmtpClient s = new SmtpClient(smtpHost, smtpPort))
                {
                    s.DeliveryMethod = SmtpDeliveryMethod.Network;
                    s.UseDefaultCredentials = false;
                    s.Credentials = new System.Net.NetworkCredential(myMail.From.ToString(), password);
                    s.EnableSsl = false;
                    s.Send(myMail);
                }
            }
        }
    }
}