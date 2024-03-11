using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Identity;
using Server.Models;

namespace Server.Helpers;

public sealed class EmailSender : IEmailSender<User>
{
    public Task SendConfirmationLinkAsync(User user, string email, string confirmationLink)
    {
        throw new NotImplementedException();
    }

    public Task SendPasswordResetLinkAsync(User user, string email, string resetLink)
    {
        throw new NotImplementedException();
    }

    public Task SendPasswordResetCodeAsync(User user, string email, string resetCode)
    {
        throw new NotImplementedException();
    }

    private async Task SendEmailAsync(string email, string subject, string message)
    {
        var client = new SmtpClient("pro1.mail.ovh.net", 993)
        {
            Credentials = new NetworkCredential("ncoustance@raki.app", "J6%ba%2XK#D9ojgtsrNC"),
            EnableSsl = true
        };

        await client.SendMailAsync(new MailMessage
        {
            From = new MailAddress("ncoustance@raki.app"),
            To = { email },
            Subject = subject,
            Body = message
        });
    }
}